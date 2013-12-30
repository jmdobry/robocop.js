'use strict';

var utils = require('../support/utils');

var robocop = module.exports = {
	Schema: require('../schema'),
	defaultRules: require('../rule'),
	defaultDataTypes: require('../dataType')
};

utils.deepMixIn(robocop, require('./schema'));
utils.deepMixIn(robocop, require('./rule'));
utils.deepMixIn(robocop, require('./dataType'));
