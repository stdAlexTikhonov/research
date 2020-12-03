/*global module,require*/
'use strict';

const assert = require('assert').strict;
const { createClientAsync } = require('soap');

const DwhWsdl = process.env.DWH_WSDL;
assert.ok(DwhWsdl, 'No DWH_WSDL in env');

const ModelCode = process.env.MODEL_CODE;
assert.ok(ModelCode, 'No MODEL_CODE in env');

const SurveyCode = process.env.SURVEY_CODE;
assert.ok(SurveyCode, 'No SURVEY_CODE in env');

function connect ()
{
    console.debug('dwh', 'connect');
    try {
        return createClientAsync(DwhWsdl);
    } catch (problem) {
        console.warn('createClientAsync', problem.message);
        throw problem;
    }
}

async function load ()
{
    console.debug('dwh', 'load');
    const client = await connect();
    try {
        const data = await client.getListAsync({
            modelCode: ModelCode,
            objectType: 'Reference',
        });
        console.debug('listXml', data.listXml);
    } catch (fail) {
        console.warn('error', fail.message);
    }
    return [];
}

async function save ()
{
    console.debug('dwh', 'save');
    // const client = await connect();
    return { ok: true };
}

module.exports = { load, save };
