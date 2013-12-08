'use strict';

var lang = require('mout/lang'),
	object = require('mout/object'),
	rules = require('../rule');

function validateSchema(schema) {
	if (!lang.isObject(schema)) {
		throw new Error('Schema(name, schema): schema: Must be an object!');
	}
}

var Schema = module.exports = function Schema(name, schema) {

	if (!lang.isString(name)) {
		throw new Error('Schema(name, schema): name: Must be a string!');
	}
	this.name = name;

	validateSchema(schema);
	this.schema = schema;
};

function _validate(targetKey, attrs) {
	var errors = {};
	var _this = this;
	object.forOwn(attrs, function (value, key) {
		var nestedKey = targetKey + (targetKey.length ? '.' : '') + key;
		if (lang.isObject(value)) {
			_validate.apply(_this, [nestedKey, value, function (err) {
				if (err) {
					errors[key] = err;
				}
			}]);
		} else {
			var schemaRules = object.get(_this.schema, nestedKey);
			object.forOwn(schemaRules, function (ruleValue, ruleKey) {
				if (!rules[ruleKey](value, ruleValue)) {
					if (!errors[key]) {
						errors[key] = {
							errors: []
						};
					}
					errors[key].errors.push(ruleKey);
				}
			});
		}
	});
	if (object.keys(errors).length > 0) {
		return errors;
	} else {
		return null;
	}
}

Schema.prototype.validate = function (attrs, options) {
	options = options || {};
	if (!lang.isObject(attrs)) {
		throw new Error('Schema.validate(attrs, options, cb): attrs: Must be an object!');
	} else if (!lang.isObject(options)) {
		throw new Error('Schema.validate(attrs, options, cb): options: Must be an object!');
	}
	return _validate.apply(this, ['', attrs]);
};
