/*global __dirname,process,require,module*/
'use strict';

const http = require('http');
const path = require('path');
const assert = require('assert').strict;

const express = require('express');
const app = express();

const page = express.Router();
const api = express.Router();

const EnvName = process.env.NODE_ENV;
assert.ok(EnvName, 'No NODE_ENV in env');

const { now } = require('./lib');

// Узнаем IP даже за прокси (https://stackoverflow.com/a/14631683).
app.set('trust proxy', true);

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
const BuildDir = path.join(RootDir, 'build');
page.use(express.static(BuildDir));

// React App.
const IndexPath = path.join(BuildDir, 'index.html');
const frontend = (req, res) => {
    // console.debug(path.relative(RootDir, IndexPath), req.path);
    assert.strictEqual(EnvName === 'production' || EnvName === 'windows', true, `${path.relative(RootDir, BuildDir)}/ is for production only`);
    res.sendFile(IndexPath);
};

// For parsing application/json
api.use(express.json());

// Вызов несуществующего метода.
const NotFoundStatus = 404;
const NotFoundMessage = http.STATUS_CODES[NotFoundStatus];

// Другие ошибки.
const BadRequestStatus = 400;
const BadRequestMessage = http.STATUS_CODES[BadRequestStatus];
function badRequest (req, res, fail) {
    console.warn(req.url, BadRequestMessage, BadRequestStatus, fail.message);
    res.status(BadRequestStatus)
       .json({
           error: true,
           message: fail.message || BadRequestMessage
       });
}

// Методы API.
api.post('/save', (req, res) => {
    try {
        console.debug('save', req.body);
        res.json({ ok: true });
    } catch (fail) {
        badRequest(req, res, fail);
    }
});

// JSON API.
app.use('/api', api);

// Вызов несуществующего метода.
api.all('*', (req, res) => {
    console.warn(NotFoundMessage, NotFoundStatus);
    res.status(NotFoundStatus)
       .json({
           error: true,
           message: NotFoundMessage
       });
});

// Страницы сайта.
const PageSlug = /^\/[a-z_-]*/;
page.get(PageSlug, frontend);
app.use(page);


// Стартуем сервер
const PortNum = +process.env.HTTP_PORT;
assert.strictEqual(PortNum >= 80, true, 'No HTTP_PORT in env');
app.listen(PortNum, () => console.info(
    `${AppLabel} listening at port ${PortNum} in ${EnvName} since ${now()}`));
