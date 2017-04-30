#!/usr/bin/env node
'use strict';

const modulePath = require('path').resolve(`${__dirname}/..`);
const magicBins = require(`magic-bins`);
magicBins(modulePath);
