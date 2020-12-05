/*global __dirname,process,require,module*/
'use strict';

const http = require('http');
const path = require('path');
const assert = require('assert').strict;

const express = require('express');
const app = express();

const page = express.Router();
const api = express.Router();

const {
    size,
    isString,
} = require('lodash');

const { now } = require('./lib');

const { save, load } = require('./dwh');

// Узнаем IP даже за прокси (https://stackoverflow.com/a/14631683).
app.set('trust proxy', true);

const EnvName = process.env.NODE_ENV;
assert.ok(EnvName, 'No NODE_ENV in env');

const AppName = process.env.REACT_APP_NAME || 'survey';
const AppVersion = process.env.REACT_APP_VERSION || 'unknown';
const AppLabel = `${AppName}@${AppVersion}`;
const logger = (req, res, next) => {
    console.debug(`${req.method} ${req.url} ${now()}`);
    // debugger;
    next();
};
app.use(logger);

// Статика.
const RootDir = path.join(__dirname, '../..');
const BuildDirName = 'build';
const BuildDir = path.join(RootDir, BuildDirName);
page.use(express.static(BuildDir));

// Вызов несуществующего метода.
const NotFoundStatus = 404;
const NotFoundMessage = http.STATUS_CODES[NotFoundStatus];

// Другие ошибки.
const BadRequestStatus = 400;
const BadRequestMessage = http.STATUS_CODES[BadRequestStatus];
function badRequest (req, res, fail) {
    const failMessage = isString(fail) ? fail : fail.message;
    console.warn(req.url, BadRequestMessage, BadRequestStatus, failMessage);
    res.status(BadRequestStatus)
       .json({
           error: true,
           message: failMessage || BadRequestMessage
       });
}

// Главная страница приложения (Rect App).
const IndexFileName = 'index.html';
const IndexPath = path.join(BuildDir, IndexFileName);
const IsProduction = EnvName === 'production' || EnvName === 'windows';
const frontend = (req, res) => {
    try {
        assert.strictEqual(IsProduction, true, `${BuildDirName}/ is for production only`);
        res.sendFile(IndexPath);
    } catch (problem) {
        console.warn(IndexFileName, req.path, EnvName, IsProduction);
        badRequest(req, res, problem);
    }
};

// For parsing application/json
api.use(express.json());

// Сохраняет Анкету.
api.post('/save', async (req, res) => {
    try {
        const data = await save(req.body);
        res.json(data);
        console.debug('api', 'save', 'done', size(data));
    } catch (fail) {
        badRequest(req, res, fail);
    }
});

// Возвращает Опросный лист.
api.get('/load', async (req, res) => {
    try {
        const data = await load();
        res.json(data);
        console.debug('api', 'load', 'done', size(data));
    } catch (fail) {
        badRequest(req, res, fail);
    }
});

// Методы JSON API.
app.use('/api', api);

// Вызов несуществующего метода.
api.all('*', (req, res) => {
    console.warn(NotFoundMessage, NotFoundStatus, req.method, req.path);
    res.status(NotFoundStatus)
       .json({
           error: true,
           message: NotFoundMessage
       });
});

// Страницы сайта.
const PageSlug = /^\/?[a-z0-9_-]*\/?$/i;
page.get(PageSlug, frontend);
app.use(page);

// Стартуем сервер
const PortNum = +process.env.HTTP_PORT;
assert.strictEqual(PortNum >= 80, true, 'No HTTP_PORT in env');
app.listen(PortNum, () => console.info(
    `${AppLabel} listening at port ${PortNum} in ${EnvName} since ${now()}`));
