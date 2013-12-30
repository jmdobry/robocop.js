'use strict';

var utils = require('../support/utils'),
	dataTypes = require('../dataType');

module.exports = {
	nullable: function (x, nullable) {
		if ((x === null || x === undefined) && !nullable) {
			return {
				rule: 'nullable',
				actual: 'x === ' + x + '',
				expected: 'x !== null && x !== undefined'
			};
		} else {
			return null;
		}
	},
	max: function (x, max) {
		if (utils.isNumber(x) && utils.isNumber(max) && x > max) {
			return {
				rule: 'max',
				actual: '' + x + ' > ' + max,
				expected: '' + x + ' <= ' + max
			};
		} else {
			return null;
		}
	},
	min: function (x, min) {
		if (utils.isNumber(x) && utils.isNumber(min) && x < min) {
			return {
				rule: 'min',
				actual: '' + x + ' < ' + min,
				expected: '' + x + ' >= ' + min
			};
		} else {
			return null;
		}
	},
	maxLength: function (x, maxLength) {
		if ((utils.isString(x) || utils.isArray(x)) && utils.isNumber(maxLength) && x.length > maxLength) {
			return {
				rule: 'maxLength',
				actual: '' + x.length + '  > ' + maxLength,
				expected: '' + x.length + ' <= ' + maxLength
			};
		} else {
			return null;
		}
	},
	minLength: function (x, minLength) {
		if ((utils.isString(x) || utils.isArray(x)) && utils.isNumber(minLength) && x.length < minLength) {
			return {
				rule: 'minLength',
				actual: '' + x.length + ' < ' + minLength,
				expected: '' + x.length + ' >= ' + minLength
			};
		} else {
			return null;
		}
	},
	type: function (x, type, customType) {
		if (customType) {
			return customType(x);
		} else {
			return dataTypes[type] ? dataTypes[type](x) : null;
		}
	}
};
