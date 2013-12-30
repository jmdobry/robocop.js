'use strict';

var utils = require('../support/utils'),
	rules = require('../rule'),
	async = require('async');

function validateSchema(schema) {
	if (!utils.isObject(schema)) {
		throw new Error('Schema(name, schema): schema: Must be an object!');
	}
}

var Schema = module.exports = function Schema(name, schema) {

	if (!utils.isString(name)) {
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
	utils.forOwn(attrs, function (value, key) {
		var nestedKey = targetKey + (targetKey.length ? '.' : '') + key;
		if (utils.isObject(value)) {
			var err = _validateSync.apply(_this, [nestedKey, value]);
			if (err) {
				errors[key] = err;
			}
		} else {
			var schemaRules = utils.get(_this.schema, nestedKey);
			utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
				var err = rules[ruleKey](value, ruleValue);
				if (err) {
					if (!errors[key]) {
						errors[key] = {
							errors: []
						};
					}
					errors[key].errors.push(err);
				}
			});
		}
	});
	if (utils.keys(errors).length > 0) {
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

	utils.forOwn(attrs, function (value, key) {
		var nestedKey = prefix + key;
		if (utils.isObject(value)) {
			// Recursive down into nested attributes
			queue[key] = (function (nK, val) {
				return function (next) {
					_validate.apply(_this, [nK, val, options, next]);
				};
			})(nestedKey, value);
		} else {
			// Test the rule for this attribute
			var schemaRules = utils.get(_this.schema, nestedKey);
			utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
				var err = rules[ruleKey](value, ruleValue);
				if (err) {
					if (!errors[key]) {
						errors[key] = {
							errors: []
						};
					}
					errors[key].errors.push(err);
				}
			});
		}
	});
	if (utils.keys(queue).length > 0) {
		async.parallel(queue, function (err, results) {

			// Merge results back up the recursion tree
			if (results) {
				results = utils.filter(results, function (x) {
					return x !== undefined && x !== null;
				});
				utils.deepMixIn(errors, results);
			}

			if (utils.keys(errors).length > 0) {
				first ? cb(errors) : cb(null, errors);
			} else {
				cb(null);
			}
		});
	} else {
		if (utils.keys(errors).length > 0) {
			first ? cb(errors) : cb(null, errors);
		} else {
			cb(null);
		}
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
	if (!utils.isObject(attrs)) {
		throw new Error('Schema#validateSync(attrs[, options]): attrs: Must be an object!');
	} else if (!utils.isObject(options)) {
		throw new Error('Schema#validateSync(attrs[, options]): options: Must be an object!');
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
	if (utils.isFunction(options)) {
		cb = options;
		options = {};
	}
	if (!utils.isFunction(cb)) {
		throw new Error('Schema#validate(attrs[, options], cb): cb: Must be a function!');
	} else if (!utils.isObject(attrs)) {
		return cb(new Error('Schema#validate(attrs[, options], cb): attrs: Must be an object!'));
	} else if (!utils.isObject(options)) {
		return cb(new Error('Schema#validate(attrs[, options], cb): options: Must be an object!'));
	}
	options.first = true;
	_validate.apply(this, ['', attrs, options, cb]);
};

/**
 * @method Schema#coerce
 * @desc Attempt to coerce the values in an object to their proper data types as specified by any "type" rules in this
 * Schema.
 * @param {object} attrs The values to coerce.
 * @returns {object} The values coerced to their proper data types.
 */
Schema.prototype.coerce = function () {
	throw new Error('Unsupported Operation!');
};

/**
 * @method Schema#addDefaults
 * @desc Add default values for those values that are missing, as specified by this Schema.
 * @param {object} attrs The values to coerce.
 * @returns {object} The values, with defaults added in.
 */
Schema.prototype.addDefaults = function () {
	throw new Error('Unsupported Operation!');
};