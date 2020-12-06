/*global module,require*/
'use strict';
const assert = require('assert').strict;

// Утилиты, https://lodash.com/docs/4.17.15
const {
  head,
  keys,
  partial,
  size,
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

const warning = (place, problem) => ({
  message: (console.warn(place, 'error', problem.message), problem.message),
  error: true
});

// Загружает Опросный лист из DWH.
async function load ()
{
  try {
    console.debug('dwh', 'load', ModelCode);
    const model = await exportModel(ModelCode);
    return model;
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
