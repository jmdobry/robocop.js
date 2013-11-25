'use strict';

var lang = require('mout/lang'),
	dataTypes = require('../dataType');

module.exports = {
	'canBeEmpty': function (x, options) {
		if (lang.isDate(x)) {
			return true;
		}
		return options ? true : !lang.isEmpty(x);
	},
	'nullable': function (x, options) {
		return options ? true : x !== null;
	},
	'required': function (x, options) {
		if (options) {
			if (x === false || x === 0) {
				return true;
			} else if (lang.isString(x)) {
				return !lang.isEmpty(x);
			} else {
				return !!x;
			}
		}
		return true;
	},
	'max': function (x, options) {
		if (lang.isNumber(x)) {
			return x <= options;
		}
		return null;
	},
	'min': function (x, options) {
		if (lang.isNumber(x)) {
			return x >= options;
		}
		return null;
	},
	'maxLength': function (x, options) {
		if (lang.isString(x) || lang.isArray(x)) {
			return x.length <= options;
		}
		return null;
	},
	'minLength': function (x, options) {
		if (lang.isString(x) || lang.isArray(x)) {
			return x.length >= options;
		}
		return null;
	},
	'type': function (x, options, customType) {
		if (customType) {
			return customType(x);
		}
		return dataTypes[options] ? dataTypes[options](x) : false;
	}
};