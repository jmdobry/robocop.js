'use strict';

var utils = require('../support/utils');

var robocop = module.exports = {
	Schema: require('../schema')
};

utils.deepMixIn(robocop, require('./schema'));
utils.deepMixIn(robocop, require('./rule'));
utils.deepMixIn(robocop, require('./dataType'));
