/*global __dirname,require,process*/
'use strict';

const path = require('path');
const RootDir = path.join(__dirname, '..');
const ScriptPath = path.join(RootDir, 'src/server/main.js');

process.chdir(RootDir);
require('dotenv').config();
require(ScriptPath);
