'use strict';

var deepMixIn = require('mout/object/deepMixIn');

var robocop = module.exports = {};

deepMixIn(robocop, require('./schema'));
deepMixIn(robocop, require('./rule'));
deepMixIn(robocop, require('./dataType'));