/*global module,require,process*/
'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const { isEmpty} = require('lodash');

// API Портала.
assert.strictEqual('PORTAL_API' in process.env, true, 'No PORTAL_API in env');
const PortalApi = process.env.PORTAL_API;

// Логин администратора Портала.
assert.strictEqual('PORTAL_LOGIN' in process.env, true, 'No PORTAL_LOGIN in env');
const PortalLogin = process.env.PORTAL_LOGIN;

// Пароль администратора Портала.
assert.strictEqual('PORTAL_PASSWORD' in process.env, true, 'No PORTAL_PASSWORD in env');
const PortalPassword = process.env.PORTAL_PASSWORD;
let PortalSession = process.env.PORTAL_SESSION || null;

assert.strictEqual('PORTAL_PROXY_PATH' in process.env, true, 'No PORTAL_PROXY_PATH in env');
const PortalFromUrl = process.env.PORTAL_PROXY_PATH || null;
assert.strictEqual('PORTAL_PROXY_TARGET' in process.env, true, 'No PORTAL_PROXY_TARGET in env');
const PortalToUrl = process.env.PORTAL_PROXY_TARGET || null;
const PortalProxyEnabled = !!PortalFromUrl && !!PortalToUrl;

const TrailingSpace = /^\s|\s$/;
const TokenFormat = /^[{][a-f0-9-]{36}[}]$/;
function verify (token) {
    if (!token) throw new Error('No token');
    if (!TokenFormat.test(token)) throw new Error('Invalid token');
    return token;
}

async function request (method, token, params) {
    const data = JSON.stringify({
        method,
        session: 'Login' === method ? void token : verify(token),
        ...params
    });
    const config = {
        url: PortalApi,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    };
    const response = await axios(config);
    const result = response.data;
    if (!result.success) throw new Error(result.error.message || `Request ${method} failed`);
    return result;
}

// const user = partial(request, 'User');

async function login (username, password)
{
  if (!username) throw new Error('No username');
  if (!password) throw new Error('No password');

  if (TrailingSpace.test(username)) throw new Error('Bad username formatting');
  if (TrailingSpace.test(password)) throw new Error('Bad password formatting');

  const result = await request('Login', null, { user: username, password });

  // Специально не учитываем в логине регистр букв.
  if (result.user.code.toLowerCase() !== username.toLowerCase())
    throw new Error('Username mismatch');

  // NB: Сессионный токен формируется Порталом из имени пользователя и пароля.
  // При повторном входе будет выдан точно такой же токен, как до того.
  const token = result.session;

  return { token };

  // const profile = await user(token);
  // profile.token = token;
  // return profile;
}

// От имени Админинстратора Портала.
let AdminToken = PortalSession;
async function admin (method, data)
{
  if (!isEmpty(PortalApi)) {
    return { token: null };
  }
  if (!AdminToken) {
    const { token } = await login(PortalLogin, PortalPassword);
    AdminToken = token.replace(/[{}]/g, '');
    console.debug('AdminToken', AdminToken);
  }
  if (!method) {
    // console.warn('portal', 'admin', 'No method');
    return { token: AdminToken };
  }
  const session = '{' + AdminToken + '}';
  return await request(method, session, data);
}

// Проксируем обращения к `/biportal`.
function portalProxy (app)
{
  if (!PortalProxyEnabled) return void !!PortalFromUrl && console.warn('portalProxy', PortalFromUrl);
  else console.debug('portalProxy', PortalFromUrl, '->', PortalToUrl);
  const portalProxyConfig = createProxyMiddleware({
    target: PortalToUrl,
    changeOrigin: true,
    pathRewrite: {
      ['^'+PortalFromUrl]: '/'
    }
  });
  app.use(PortalFromUrl, portalProxyConfig);
}

module.exports = {
  admin,
  portalProxy,
};
