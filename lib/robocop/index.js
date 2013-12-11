'use strict';

var deepMixIn = require('mout/object/deepMixIn');

var robocop = module.exports = {
	Schema: require('../schema'),
	defaultRules: require('../rule'),
	defaultDataTypes: require('../dataType')
};

deepMixIn(robocop, require('./schema'));
deepMixIn(robocop, require('./rule'));
deepMixIn(robocop, require('./dataType'));
