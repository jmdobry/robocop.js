'use strict';

var lang = require('mout/lang'),
	toInt = require('mout/number/toInt');

module.exports = {
	'string': lang.isString,
	'number': lang.isNumber,
	'integer': function (x) {
		if (!lang.isNumber(x)) {
			return false;
		}
		return Math.abs(x) - Math.abs(toInt(x)) === 0;
	},
	'float': lang.isNumber,
	'array': lang.isArray,
	'object': lang.isObject,
	'boolean': lang.isBoolean,
	'date': lang.isDate
};