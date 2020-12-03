/*global module,require*/
'use strict';

const assert = require('assert').strict;

const fs = require('fs');

const {
    head,
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
    console.debug('dwh', 'connect', DwhWsdl);
    try {
        console.debug('dwh', 'connect', 'createClientAsync', '...');
        return createClientAsync(DwhWsdl);
    } catch (fail) {
        console.warn('dwh', 'connect', 'createClientAsync', fail.message);
        throw problem;
    }
}

// Загружает Опросный лист из DWH.
async function load ()
{
    try {
        const client = await connect();
        console.debug('dwh', 'load', 'getListAsync', '...');
        const [ { listXml } ] = await client.getListAsync({
            modelCode: ModelCode,
            objectType: 'Reference',
        });
        console.debug('dwh', 'load', 'parseStringPromise', '...');
        const config = await parseStringPromise(listXml);
        // console.debug('dwh', 'load', 'config', config);
        return config;
    } catch (fail) {
        const { message } = fail;
        console.warn('dwh', 'load', 'ERROR', message);
        return { error: true,
                 message };
    }
}

// Сохраняет Анкету в DWH.
async function save ()
{
    console.debug('dwh', 'save');
    // const client = await connect();
    return { ok: true };
}

module.exports = { load, save };
