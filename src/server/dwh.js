/*global module,require*/
'use strict';

const assert = require('assert').strict;

const {
    head,
    keys,
    size,
} = require('lodash');

const { parseStringPromise } = require('xml2js');

const { createClientAsync } = require('soap');

const DwhWsdl = process.env.DWH_WSDL;
assert.ok(DwhWsdl, 'No DWH_WSDL in env');

const ModelCode = process.env.MODEL_CODE;
assert.ok(ModelCode, 'No MODEL_CODE in env');

const SurveyCode = process.env.SURVEY_CODE;
assert.ok(SurveyCode, 'No SURVEY_CODE in env');

// Соединение с DWH.
function connect ()
{
    let client = null;
    try {
        console.debug('dwh', 'connect', 'createClientAsync', DwhWsdl);
        client = createClientAsync(DwhWsdl);
    } catch (fail) {
        console.warn('dwh', 'connect', 'createClientAsync', 'error', fail.message, DwhWsdl);
    }
    return client;
}

// Загружает Опросный лист из DWH.
async function load ()
{
    try {
        const client = await connect();
        assert.ok(client, 'Failed connecting to DWH');
        console.debug('dwh', 'load', 'exportModelAsync', ModelCode);
        const request = { modelCode: ModelCode };
        const [ { modelXml } ] = await client.exportModelAsync(request);
        console.debug('dwh', 'load', 'parseStringPromise', size(modelXml));
        const { Model } = await parseStringPromise(modelXml);
        console.debug('dwh', 'load', 'modelXml.Model', '(' + keys(Model).join(', ') + ')');
        return Model;
    } catch (fail) {
        const { message } = fail;
        console.warn('dwh', 'load', 'fail', message);
        return { error: true,
                 message };
    }
}

// Сохраняет Анкету в DWH.
async function save (data)
{
    try {
        console.debug('dwh', 'save', size(data));
        const client = await connect();
        throw new Error('Not implemented');
    } catch (fail) {
        const { message } = fail;
        console.warn('dwh', 'save', 'fail', message);
        return { error: true,
                 message };
    }
}

module.exports = { load, save };
