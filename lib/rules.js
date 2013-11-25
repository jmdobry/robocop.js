'use strict';

var lang = require('mout/lang'),
	dataTypes = require('./dataTypes');

module.exports = {
	'canBeEmpty': function (attr, x) {
		if (lang.isDate(x)) {
			return true;
		}
		return attr ? true : !lang.isEmpty(x);
	},
	'nullable': function (attr, x) {
		return attr ? true : x !== null;
	},
	'required': function (attr, x) {
		if (attr) {
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
	'max': function (max, x) {
		if (lang.isNumber(x)) {
			return x <= max;
		}
		return null;
	},
	'min': function (min, x) {
		if (lang.isNumber(x)) {
			return x >= min;
		}
		return null;
	},
	'maxLength': function (maxLength, x) {
		if (lang.isString(x) || lang.isArray(x)) {
			return x.length <= maxLength;
		}
		return null;
	},
	'minLength': function (minLength, x) {
		if (lang.isString(x) || lang.isArray(x)) {
			return x.length >= minLength;
		}
		return null;
	},
	'type': function (type, x) {
		return dataTypes[type] ? dataTypes[type](x) : false;
	}
};