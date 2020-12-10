/*global module,require*/
'use strict';
const assert = require('assert').strict;

// Утилиты, https://lodash.com/docs/4.17.15
const {
  compact,
  concat,
  head,
  keys,
  map,
  mapValues,
  omit,
  partial,
  result,
  size,
  sortBy,
  without,
} = require('lodash');

// Веб-сервис, https://en.wikipedia.org/wiki/SOAP
const { createClientAsync } = require('soap');

// Разбор XML, https://www.npmjs.com/package/xml2js
const { parseStringPromise } = require('xml2js');

// XML описания сервиса Хранилища.
const DwhWsdlPath = process.env.DWH_WSDL_PATH;
assert.ok(DwhWsdlPath, 'No DWH_WSDL_PATH in env');

// Код Модели в Хранилище.
const ModelCode = process.env.MODEL_CODE;
assert.ok(ModelCode, 'No MODEL_CODE in env');

// Код Обследования.
const SurveyCode = process.env.SURVEY_CODE;
assert.ok(SurveyCode, 'No SURVEY_CODE in env');

// Клиент для обращений к веб-сервису Хранилища.
async function connection (soapWsdl)
{
  let client = null;
  try {
    assert.ok(soapWsdl, 'No soapWsdl');
    console.debug('dwh', 'connection', 'createClientAsync', soapWsdl);
    const options = {
      attributesKey: '$attributes'
    };
    client = await createClientAsync(soapWsdl, options);
    if (!client) throw new Error('Problem connecting to DWH');
  } catch (fail) {
    console.warn('dwh', 'connection', 'error', fail.message);
  }
  return client;
}

// Соединение с веб-сервисом Хранилища данных.
const connect = partial(connection, DwhWsdlPath);

const warning = (place, problem) => ({
  message: (console.warn(place, 'error', problem.message), problem.message),
  error: true
});

// Получает описание модели.
async function exportModel (modelCode)
{
  assert.ok(modelCode, 'No modelCode');
  const client = await connect();
  console.debug('dwh', 'exportModel', 'exportModelAsync', 'modelCode', modelCode);
  const request = { modelCode };
  const [ { modelXml } ] = await client.exportModelAsync(request);
  console.debug('dwh', 'exportModel', 'parseStringPromise', 'modelXml', size(modelXml));
  const { Model } = await parseStringPromise(modelXml);
  console.debug('dwh', 'exportModel', 'Model', size(Model), '(' + keys(Model).join(', ') + ')');
  return Model;
}

// Получает описание модели.
async function queryExtendedData (modelCode, objectType, objectCode)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(objectType, 'No objectType');
  assert.ok(objectCode, 'No objectCode');
  const client = await connect();
  const request = { modelCode, objectType, objectCode };
  console.debug('dwh', 'queryExtendedData', 'queryExtendedDataAsync', request);
  const [ { xmlResponse } ] = await client.queryExtendedDataAsync(request);
  console.debug('dwh', 'queryExtendedData', 'parseStringPromise', 'xmlResponse', size(xmlResponse));
  const { Model } = await parseStringPromise(xmlResponse);
  console.debug('dwh', 'queryExtendedData', 'Model', size(Model), '(' + keys(Model).join(', ') + ')');
  return Model;
}

// Вставляет строку в Series.
const SeriesSuffix = '_timeseries';
const SeriesType = 'Series';
async function insertRow (modelCode, surveyCode, record)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(surveyCode, 'No surveyCode');
  assert.ok(record, 'No record');
  const seriesCode = surveyCode + SeriesSuffix;
  const data = map(record, (value, key) => ({
    Value: { $attributes: { concept: key, value } }
  }));
  const row = {
    modelCode,
    objectType: SeriesType,
    objectCode: seriesCode,
    rowData: {
      Attributes: data
    }
  };
  const client = await connect();
  console.debug('dwh', 'insertRow', seriesCode, size(record));
  const [ { rowId } ] = await client.insertRowAsync(row);
  const intRowId = +rowId;
  console.debug('dwh', 'insertRow', intRowId);
  console.debug(client.lastRequest);
  return intRowId;
}

const QSortKey = 'sort_order';
const QuestionaryType = 'Questionary';
const QIntKeys = [ 'action_id', QSortKey, 'condition', 'question_num', 'question_group' ];
const QBoolKeys = [ 'multiply_values', 'other_allowed' ];
const QOmitKeys = [ QSortKey, 'action_id' ];
const ReferenceType = 'Reference';
const RIntKeys = [ 'code', 'question_num' ];
const RBoolKeys = [];
const ROmitKeys = [];
const GroupRefCode = 'question_groups';
// Загружает Опросный лист из DWH.
async function load (survey)
{
  assert.ok(survey, 'No survey');
  try {
    console.debug('dwh', 'load', 'queryExtendedData', ModelCode, survey);
    const { Questionaries, References } = await queryExtendedData(ModelCode, QuestionaryType, survey);
    const questions = result(Questionaries, [ 0, QuestionaryType, 0 ]);
    const form = questions.$;
    const qs = map(head(questions.Rows).Row, (row) => {
      const record = mapValues(row, head);
      for (let key of QIntKeys) if (key in record) record[key] = +record[key];
      for (let key of QBoolKeys) if (key in record) record[key] = !!+record[key];
      if ('multiply_values' in record) {
        record.multiple_values = record.multiply_values;
        delete record.multiply_values;
      }
      if (!!record.other_allowed) {
        record.other_text = 'Другое (уточните)';
      }
      return record;
    });
    const refs = result(head(References), [ ReferenceType ], []);
    const rs = {};
    let first = true;
    for (let ref of refs) {
      const Reference = compact(map(
        concat(result(ref, [ 'Rows', 0, 'Row' ], []),
               result(ref, [ 'Rows', 0, 'question_rows', 0, 'Row' ], [])),
        (row) => {
          const record = mapValues(row, head);
          for (let key of RIntKeys) if (key in record) record[key] = +record[key];
          for (let key of RBoolKeys) if (key in record) record[key] = !!+record[key];
          return record;
        }));
      const that = ref.$;
      const code = first ? GroupRefCode : that.code;
      if (first) that[GroupRefCode] = true;
      rs[code] = omit({ ...that, Reference }, ROmitKeys);
      if (first) first = false;
    }
    form.Questionary = map(sortBy(qs, QSortKey), (record) => omit(record, QOmitKeys));
    form.References = rs;
    console.debug('dwh', 'load', size(form.Questionary), '(' + keys(form).join(', ') + ')');
    return form;
  } catch (fail) {
    return warning('load', fail);
  }
}

// Сохраняет Анкету в DWH.
async function save (form)
{
  try {
    assert.ok(form, 'No form');
    const { responent, questions } = form;
    console.debug('dwh', 'save', size(form));
    console.debug('dwh', 'save',  size(questions), JSON.stringify(form, null, 4));
    const row = {
      respondent_login: '1ade505a-3ae4-11eb-a158-0bdd491ae1a0',
      respondent_ip: '127.0.0.1',
      q_v8_3: 1
    };
    console.debug('dwh', 'save', row);
    const result = await insertRow(ModelCode, SurveyCode, row);
    console.debug('dwh', 'save', result);
  } catch (fail) {
    return warning('save', fail);
  }
}

module.exports = { load, save, SurveyCode };
