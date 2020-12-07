/*global module,require*/
'use strict';
const assert = require('assert').strict;

// Утилиты, https://lodash.com/docs/4.17.15
const {
  head,
  keys,
  map,
  mapValues,
  partial,
  result,
  size,
  sortBy,
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
    client = await createClientAsync(soapWsdl);
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

// Загружает Опросный лист из DWH.
const QuestionaryType = 'Questionary';
async function load ()
{
  try {
    console.debug('dwh', 'load', ModelCode, SurveyCode);
    const { Questionaries } = await queryExtendedData(ModelCode, QuestionaryType, SurveyCode);
    const response = result(Questionaries, [ 0, QuestionaryType, 0 ]);
    const form = response.$;
    form[QuestionaryType] = sortBy(map(result(response.Rows, [ 0, 'Row' ]),
                                       (row) => mapValues(row, head),
                                       'sort_order'));
    console.debug('dwh', 'load', 'queryExtendedData', '(' + keys(form).join(', ') + ')',  size(form[QuestionaryType]));
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
    console.debug('dwh', 'save', size(form));
    const client = await connect();
    throw new Error('Not implemented');
  } catch (fail) {
    return warning('save', fail);
  }
}

module.exports = { load, save };
