'use strict';

var lang = require('mout/lang'),
	object = require('mout/object'),
	rules = require('../rule'),
	async = require('async');

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

/**
 * @see Schema#validateSync
 */
function _validateSync(targetKey, attrs) {
	var errors = {};
	var _this = this;
	object.forOwn(attrs, function (value, key) {
		var nestedKey = targetKey + (targetKey.length ? '.' : '') + key;
		if (lang.isObject(value)) {
			_validateSync.apply(_this, [nestedKey, value, function (err) {
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

/**
 * @see Schema#validate
 */
function _validate(targetKey, attrs, options, cb) {
	var errors = {},
		_this = this,
		prefix = targetKey + (targetKey.length ? '.' : ''),
		queue = {},
		first = options.first;

	delete options.first;

	object.forOwn(attrs, function (value, key) {
		var nestedKey = prefix + key;
		if (lang.isObject(value)) {
			// Recursive down into nested attributes
			queue[key] = (function (nK, val) {
				return function (next) {
					_validate.apply(_this, [nK, val, options, next]);
				};
			})(nestedKey, value);
		} else {
			// Test the rule for this attribute
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
	if (object.keys(queue).length > 0) {
		async.parallel(queue, function (err, results) {

			// Merge results back up the recursion tree
			if (results) {
				results = object.filter(results, function (x) {
					return x !== undefined && x !== null;
				});
				object.deepMixIn(errors, results);
			}

			if (object.keys(errors).length > 0) {
				first ? cb(errors) : cb(null, errors);
			} else {
				cb(null);
			}
		});
	} else {
		if (object.keys(errors).length > 0) {
			first ? cb(errors) : cb(null, errors);
		} else {
			cb(null);
		}
	}
	if (!options.ignoreMissing) {
		// TODO: throw errors for missing attributes that are set to `nullable: false`
	}
}

/**
 * @method Schema#validateSync
 * @desc Validate (synchronously) the given attributes against this Schema instance.
 * @param {object} attrs The attributes to validate.
 * @param {object} [options={}] Optional configuration.
 * @property {boolean} [options.ignoreMissing=false] If true this method will ignore validation for defined schema
 * properties that don't appear in the given hash of attributes. This is useful for validating incremental updates to an
 * object, when you don't have the full attributes of the object (client-side validation).
 * @returns {object|null} Null if validation succeeds or an error object if validation fails.
 */
Schema.prototype.validateSync = function (attrs, options) {
	options = options ? (options === true ? { ignoreMissing: true } : options) : {};
	if (!lang.isObject(attrs)) {
		throw new Error('Schema#validate(attrs[, options]): attrs: Must be an object!');
	} else if (!lang.isObject(options)) {
		throw new Error('Schema#validate(attrs[, options]): options: Must be an object!');
	}
	return _validateSync.apply(this, ['', attrs, options]);
};

/**
 * @method Schema#validate
 * @desc Validate the given attributes against this Schema instance.
 * @param {object} attrs The attributes to validate.
 * @param {object} [options={}] Optional configuration.
 * @property {boolean} [options.ignoreMissing=false] If true this method will ignore validation for defined schema
 * properties that don't appear in the given hash of attributes. This is useful for validating incremental updates to an
 * object, when you don't have the full attributes of the object (client-side validation).
 * @param {function} cb Callback function. Will receive no arguments if validation succeeds and an error object if
 * validation fails.
 */
Schema.prototype.validate = function (attrs, options, cb) {
	options = options ? (options === true ? { ignoreMissing: true } : options) : {};
	if (lang.isFunction(options)) {
		cb = options;
		options = {};
	}
	if (!lang.isFunction(cb)) {
		throw new Error('Schema#validate(attrs[, options], cb): cb: Must be a function!');
	} else if (!lang.isObject(attrs)) {
		cb(new Error('Schema#validate(attrs[, options], cb): attrs: Must be an object!'));
	} else if (!lang.isObject(options)) {
		cb(new Error('Schema#validate(attrs[, options], cb): options: Must be an object!'));
	}
	options.first = true;
	_validate.apply(this, ['', attrs, options, cb]);
};

Schema.prototype.coerce = function (attrs) {
	return attrs;
};

Schema.prototype.addDefaults = function (attrs) {
	return attrs;
};
