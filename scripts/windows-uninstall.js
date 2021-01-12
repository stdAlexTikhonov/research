/*global __dirname,require,process*/
'use strict';

// Read more in ./windows-install.js
const ServiceName = 'Survey WebApp';
const ScriptPath = require('path').join(__dirname, 'server.js');

// https://github.com/coreybutler/node-windows
const Service = require('node-windows').Service;

// Create a new service object.
const svc = new Service({
    name: ServiceName,
    script: ScriptPath
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Run `node windows-uninstall.js` as an Administrator.
svc.uninstall();
