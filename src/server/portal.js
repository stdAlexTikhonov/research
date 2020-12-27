/*global module,require,process*/
'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const {
    partial,
    get,
    trim,
    chain,
} = require('lodash');

const axios = require('axios');

// API Портала.
const PortalApi = process.env.PORTAL_API;
assert.ok(PortalApi, 'No PORTAL_API in env');

// Логин администратора Портала.
const PortalLogin = process.env.PORTAL_LOGIN;
assert.ok(PortalLogin, 'No PORTAL_LOGIN in env');

// Пароль администратора Портала.
const PortalPassword = process.env.PORTAL_PASSWORD;
assert.ok(PortalPassword, 'No PORTAL_PASSWORD in env');

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
let AdminToken = null;
async function admin (method, data)
{
  if (!AdminToken) {
    const { token } = await login(PortalLogin, PortalPassword);
    AdminToken = token;
  }
  console.debug('AdminToken', AdminToken);
  if (!method) {
    console.warn('portal', 'admin', 'No method');
    return { token: AdminToken };
  }
  return await request(method, AdminToken, data);
}

module.exports = {
  admin,
};
