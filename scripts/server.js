/*global __dirname,require,process*/
'use strict';
const path = require('path');
const assert = require('assert').strict;

const RootDir = path.join(__dirname, '..');
process.chdir(RootDir);

require('dotenv').config();
assert.ok(process.env.NODE_ENV, 'No NODE_ENV in env');

const ScriptPath = 'src/server/main.js';
const FullPath = path.join(RootDir, ScriptPath);
require(FullPath);
