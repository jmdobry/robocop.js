'use strict';

var lang = require('mout/lang'),
	toInt = require('mout/number/toInt');

module.exports = {
	'string': function (x) {
		if (lang.isNumber(x)) {
			return lang.toString(x);
		}
		return x;
	},
	'number': lang.toNumber,
	'integer': function (x) {
		var num = lang.toNumber(x);
		if (lang.isNumber(num) && !isNaN(num)) {
			return toInt(num);
		}
		return lang.toNumber(x);
	},
	'float': function (x) {
		if (x === null || x === '' || x === false || lang.isUndefined(x)) {
			return 0.0;
		} else if (x === true) {
			return 1.0;
		}
		return parseFloat(x);
	},
	'array': function (x) {
		if (lang.isArray(x) && !lang.isEmpty(x)) {
			return x;
		} else if (x === null || lang.isUndefined(x) || lang.isEmpty(x)) {
			return null;
		}
		return [x];
	},
	'object': function (x) {
		if (lang.isObject(x) && !lang.isEmpty(x)) {
			return x;
		} else if (x === null || lang.isUndefined(x) || lang.isEmpty(x)) {
			return null;
		}
		return x;
	},
	'boolean': function (x) {
		if (lang.isEmpty(x)) {
			return false;
		}
		return !!x;
	}
	// TODO: Coercions for dates
};