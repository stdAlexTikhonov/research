/*global __dirname,require,process*/
'use strict';

// Create Windows service with [node-windows](https://github.com/coreybutler/node-windows).
//
// (1) Install npm package:
//
//     npm install -g node-windows
//     npm link node-windows
//
// (2) Run as an Administrator:
//
//     node windows-service.js
//
// More commands:
//
// * Remove the service by `node windows-uninstall.js`.
// * Start the service: `net start "Survey WebApp"`.
// * Stop it: `net stop "Survey WebApp"`.
// * Read the logs in ./daemon/ directory.
//
const ServiceName = 'Survey WebApp';
const ScriptPath = require('path').join(__dirname, 'server.js');

const Service = require('node-windows').Service;

// Create a new service object.
const svc = new Service({
    name: ServiceName,
    description: 'Survey',
    env: [{
        name: 'NODE_ENV',
        value: process.env['NODE_ENV'] || 'windows'
    }],
    script: ScriptPath
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

svc.install();
