/*global module,require*/
'use strict';
const assert = require('assert').strict;

// Утилиты, https://lodash.com/docs/4.17.15
const {
  compact,
  concat,
  fromPairs,
  get,
  head,
  isArray,
  isEmpty,
  isObject,
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

const moment = require('moment');

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

const SeriesSuffix = process.env.SERIES_SUFFIX;
assert.ok(SeriesSuffix, 'No SERIES_SUFFIX in env';
const SurveyPeriod = moment().format('YYYY-12-31');

// Лог загрузок.
assert.ok(!('LoadLogSeries' in process.env), 'No LOADLOG_SERIES in env');
const LoadLogSeries = process.env.LOADLOG_SERIES;

// Клиент для обращений к веб-сервису Хранилища.
async function connection (soapWsdl)
{
  let client = null;
  try {
    assert.ok(soapWsdl, 'No soapWsdl');
    console.debug('dwh', 'connection', 'createClientAsync', soapWsdl);
    const options = {
      attributesKey: '$attributes',
      namespaceArrayElements: false,
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

// Получает список объектов указанного типа.
async function getList (modelCode, objectType)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(objectType, 'No objectType');
  const client = await connect();
  console.debug('dwh', 'getList', 'modelCode', modelCode, 'objectType', objectType);
  const request = { modelCode, objectType };
  const [ { listXml } ] = await client.getListAsync(request);
  console.debug('dwh', 'getList', 'listXml', size(listXml));
  const { list } = await parseStringPromise(listXml);
  console.debug('dwh', 'getList', 'list', size(list));
  return list;
}

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
const SeriesType = 'Series';
async function insertRow (modelCode, seriesCode, record)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(seriesCode, 'No seriesCode');
  assert.ok(record, 'No record');
  console.debug('dwh', 'insertRow', record);
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
  // console.debug(JSON.stringify(row, null, 4), client.lastRequest);
  return intRowId;
}

async function updateRow (modelCode, seriesCode, rowId, record)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(seriesCode, 'No seriesCode');
  assert.ok(record, 'No record');
  console.debug('dwh', 'updateRow', record);
  const data = map(record, (value, key) => ({
    Value: { $attributes: { concept: key, value } }
  }));
  const row = {
    modelCode,
    objectType: SeriesType,
    objectCode: seriesCode,
    rowId,
    rowData: {
      Attributes: data
    }
  };
  const client = await connect();
  console.debug('dwh', 'updateRow', seriesCode, size(record));
  const result = await client.updateRowAsync(row);
  // console.debug('dwh', 'updateRow', row, client.lastRequest);
  return result;
}

async function query (modelCode, seriesCode, conditions)
{
  assert.ok(modelCode, 'No modelCode');
  assert.ok(seriesCode, 'No seriesCode');
  assert.ok(conditions, 'No conditions');
  console.debug('dwh', 'query', modelCode, seriesCode);
  const client = await connect();
  const request = {
    modelCode,
    objectType: SeriesType,
    objectCode: seriesCode,
    conditions: map(conditions, (item, fieldCode) => ({
      item: {
        fieldCode,
        operator: 'Equals',
        parameters: { item },
      }
    })),
    pageNumber: -1,
    pageSize: -1,
  };
  return await client.queryAsync(request);
}

const QSortKey = 'sort_order';
const QuestionaryType = 'Questionary';
const QIntKeys = [ 'action_id', QSortKey, 'condition', 'question_num', 'question_group', 'default_value' ];
const QBoolKeys = [ 'multiple_values', 'other_allowed' ];
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
        record.other_text = 'Другое (уточните)'; // TODO: В конфиг.
        if (!!record.other_caption) {
          record.other_text = record.other_caption;
          delete record.other_caption; // TODO: Оставить только caption.
        }
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

// Загружает Опросный лист из DWH.
async function list ()
{
  try {
    console.debug('dwh', 'list', ModelCode);
    const { item } = await getList(ModelCode, QuestionaryType);
    console.debug('dwh', 'list', 'getList', size(item));
    const found = item.map((record) => {
      const { code, caption } = record.$;
      return { code, caption };
    });
    return found;
  } catch (fail) {
    return warning('list', fail);
  }
}

// Сохраняет Анкету в DWH.
const QuestionPrefix = 'q_';
const AnswerSuffix = '_';
const OtherSuffix = '_other';
async function save (survey, login, answers, ip)
{
  try {
    assert.ok(survey, 'No survey');
    assert.ok(login, 'No login');
    assert.ok(answers, 'No answers');
    const seriesCode = survey + SeriesSuffix;
    console.debug('dwh', 'save', ModelCode, survey, login, size(answers), answers, ip);
    // console.debug('dwh', 'save',  size(answers), JSON.stringify(data, null, 4));
    const conditions = {
      respondent_login: login,
      period: SurveyPeriod
    };
    const [ { DataSet } ] = await query(ModelCode, seriesCode, conditions);
    // console.debug(DataSet);
    const found = !!size(DataSet.Group[0].Series[0]);

    const record = {
      respondent_login: login,
      respondent_ip: ip,
      period: SurveyPeriod,
    };

    for (let code in answers) {
      const info = answers[code];
      let key = QuestionPrefix + code;
      // TODO: Получать по опоснику вместо проверки массив/число.
      if (isArray(info.answers)) {
        info.answers = compact(info.answers);
        let n = 0;
        for (let answer of info.answers) {
          ++n;
          const k = key + AnswerSuffix + n;
          const v = +answer
          record[k] = v;
        }
      } else {
        const a = +info.answers;
        if (!!a) {
          record[key] = a;
        }
      }
      if (!!info.other) {
        record[key + OtherSuffix] = info.other;
      }
    }

    if (!found) {
      console.debug('dwh', 'save', 'insertRow', ModelCode, seriesCode, size(record));
      const rowId = await insertRow(ModelCode, seriesCode, record);
      return { rowId };
    } else {
      const rowId = 1; // FIXME
      console.debug('dwh', 'save', 'updateRow', ModelCode, seriesCode, rowId, size(record));
      await updateRow(ModelCode, seriesCode, rowId, record);
    }
    console.debug('dwh', 'save', 'ok');
  } catch (fail) {
    return warning('save', fail);
  }
}

// Журнал загрузки данных.
async function loadlog ()
{
  if (isEmpty(LoadLogSeries))
    return void console.warn('LoadLogSeries is empty');
  console.debug('dwh', 'loadlog', 'query', LoadLogSeries);
  const [ , xml ] = await query(ModelCode, LoadLogSeries, []);
  const response = await parseStringPromise(xml);
  const SubNs = 'ns2';
  const ExtractA = [ 'soap:Envelope', 'soap:Body', 0, 'queryResponse', 0, 'DataSet', 0,
                     `${SubNs}:Group`, 0, `${SubNs}:Series`, 0, `${SubNs}:Obs` ];
  const ExtractB = [ `${SubNs}:Attributes`, 0, `${SubNs}:Value` ];
  const list = get(response, ExtractA, [])
    .map((row) => get(row, ExtractB, false))
    .filter(isObject)
    .map((row) =>
      fromPairs(row.map((col) => [ get(col, [ '$', 'concept' ], null),
                         get(col, [ '$', 'value' ], null) ])));

  if (isEmpty(list)) console.warn('dwh', 'loadlog', 'Empty log');
  return list;
}

module.exports = {
  SurveyCode,
  list, load, save,
  loadlog,
};
