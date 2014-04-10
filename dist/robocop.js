/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.14.1 - Homepage <http://jmdobry.github.io/robocop.js/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>
 * @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>
 *
 * @overview Define and validate rules, datatypes and schemata in Node and in the browser.
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.robocop=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils');

module.exports = {
	string: function (x) {
		if (utils.isString(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'string'
			};
		}
	},
	number: function (x) {
		if (utils.isNumber(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'number'
			};
		}
	},
	integer: function (x) {
		if (!utils.isNumber(x)) {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'integer'
			};
		} else if (Math.abs(x) - Math.abs(utils.toInt(x)) !== 0) {
			return {
				rule: 'type',
				actual: 'real',
				expected: 'integer'
			};
		} else {
			return null;
		}
	},
	float: function (x) {
		if (utils.isNumber(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'float'
			};
		}
	},
	array: function (x) {
		if (utils.isArray(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'array'
			};
		}
	},
	object: function (x) {
		if (utils.isObject(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'object'
			};
		}
	},
	boolean: function (x) {
		if (utils.isBoolean(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'boolean'
			};
		}
	},
	date: function (x) {
		if (utils.isDate(x)) {
			return null;
		} else {
			return {
				rule: 'type',
				actual: typeof x,
				expected: 'date'
			};
		}
	}
};

},{"../support/utils":10}],2:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils'),
	dataTypes = _dereq_('../dataType');

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
				actual: '' + x.length + ' > ' + maxLength,
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

},{"../dataType":1,"../support/utils":10}],3:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.13.0 - Homepage <http://jmdobry.github.io/robocop.js/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>
 * @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>
 *
 * @overview Define and validate rules, datatypes and schemata in Node and in the browser.
 */

module.exports = _dereq_('./robocop');

},{"./robocop":5}],4:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils');

var defaultDataTypes = _dereq_('../dataType');

var dataTypes = {};

module.exports = {
	defineDataType: function (name, typeDefinition) {
		if (!utils.isString(name)) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Must be a string!');
		} else if (!utils.isFunction(typeDefinition)) {
			throw new Error('robocop.defineDataType(name, typeDefinition): typeDefinition: Must be a function!');
		} else if (dataTypes[name]) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Name already in use!');
		}
		dataTypes[name] = typeDefinition;
	},

	getDataType: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.getDataType(name): name: Must be a string!');
		}
		return dataTypes[name] || defaultDataTypes[name];
	},

	availableDataTypes: function () {
		return utils.keys(dataTypes).concat(utils.keys(defaultDataTypes));
	},

	removeDataType: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.removeDataType(name): name: Must be a string!');
		}
		if (dataTypes[name]) {
			delete dataTypes[name];
		}
	}
};

},{"../dataType":1,"../support/utils":10}],5:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils');

var robocop = module.exports = {
	Schema: _dereq_('../schema')
};

utils.deepMixIn(robocop, _dereq_('./schema'));
utils.deepMixIn(robocop, _dereq_('./rule'));
utils.deepMixIn(robocop, _dereq_('./dataType'));

},{"../schema":9,"../support/utils":10,"./dataType":4,"./rule":6,"./schema":7}],6:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils');

var defaultRules = _dereq_('../defaultRules');

var rules = _dereq_('../rules');

module.exports = {
	defineRule: function (name, ruleFunc, async) {
		if (!utils.isString(name)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): name: Must be a string!');
		} else if (!utils.isFunction(ruleFunc)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): ruleFunc: Must be a function!');
		} else if (rules[name]) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): name: Name already in use!');
		} else if (async && !utils.isBoolean(async)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): async: Must be a boolean!');
		}
		rules[name] = ruleFunc;
		if (async) {
			rules[name].async = true;
		}
	},

	getRule: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.getRule(name): name: Must be a string!');
		}
		return rules[name] || defaultRules[name];
	},

	availableRules: function () {
		return utils.keys(rules).concat(utils.keys(defaultRules));
	},

	removeRule: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.removeRule(name): name: Must be a string!');
		}
		if (rules[name]) {
			delete rules[name];
		}
	}
};

},{"../defaultRules":2,"../rules":8,"../support/utils":10}],7:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../support/utils'),
	Schema = _dereq_('../schema');

var schemas = {};

module.exports = {
	defineSchema: function (name, schema) {
		if (schemas[name]) {
			throw new Error('robocop.defineSchema(name, schema): name: Name already in use!');
		}
		if (schema instanceof Schema) {
			schemas[name] = schema;
		} else {
			if (!utils.isObject(schema)) {
				throw new Error('robocop.defineSchema(name, schema): schema: Must be an object or an instance of Schema!');
			}
			schemas[name] = new Schema(name, schema);
		}
		return schemas[name];
	},

	getSchema: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.getSchema(name): name: Must be a string!');
		}
		return schemas[name];
	},

	availableSchemas: function () {
		return utils.keys(schemas);
	},

	removeSchema: function (name) {
		if (!utils.isString(name)) {
			throw new Error('robocop.removeSchema(name): name: Must be a string!');
		}
		if (schemas[name]) {
			delete schemas[name];
		}
	}
};

},{"../schema":9,"../support/utils":10}],8:[function(_dereq_,module,exports){
'use strict';

module.exports = {};

},{}],9:[function(_dereq_,module,exports){
/*jshint latedef:false*/
'use strict';

var utils = _dereq_('../support/utils'),
	defaultRules = _dereq_('../defaultRules'),
	rules;

var _parallel = function (tasks, cb) {
	var results = {},
		completed = 0,
		length = 0;

	utils.forOwn(tasks, function () {
		length += 1;
	});


	utils.forOwn(tasks, function (task, key) {
		task(function (err) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (args.length <= 1) {
				args = args[0];
			}
			results[key] = args;
			done(err);
		});
	});

	function done(err) {
		completed += 1;
		if (err || completed >= length) {
			cb(err, results);
		}
	}
};

function _sanitize(attrs, rules) {
	rules = rules || [];
	var keys = utils.keys(attrs),
		noRules = utils.intersection(keys, rules).length === 0;

	utils.forOwn(attrs, function (value, key) {
		if (noRules && utils.isString(value)) {
			attrs[key] = {
				type: value
			};
		} else if (utils.isObject(value)) {
			if (utils.contains(rules, key)) {
				throw new Error('Schema(name, schema): schema: Rule configuration for rule "' + key + '" cannot be an object!');
			} else {
				_sanitize(value, rules);
			}
		}
	});
}

function validateSchema(schema) {
	if (!utils.isObject(schema)) {
		throw new Error('Schema(name, schema): schema: Must be an object!');
	}
	_sanitize(schema, _dereq_('../robocop/rule').availableRules());
}

var Schema = module.exports = function Schema(name, schema) {

	if (!utils.isString(name)) {
		throw new Error('Schema(name, schema): name: Must be a string!');
	}
	this.name = name;

	validateSchema(schema);
	this.schema = schema;
	rules = _dereq_('../rules');
};

function _executeRulesSync(targetKey, options, errors, value, key) {
	var _this = this,
		nestedKey = targetKey + (targetKey.length ? '.' : '') + key;

	if (utils.isObject(value)) {
		var err = _validateSync.apply(_this, [nestedKey, value, options]);
		if (err) {
			errors[key] = err;
		}
	} else {
		var schemaRules = utils.get(_this.schema, nestedKey);
		if (!utils.isObject(schemaRules)) {
			return;
		} else if (schemaRules.nullable === true) {
			var nullable = rules.nullable || defaultRules.nullable,
				nErr = nullable(value, true);

			if (nErr === null) {
				return;
			}
		}
		utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
			var rule = rules[ruleKey] || defaultRules[ruleKey];
			if (!rule.async) {
				var err = rule(value, ruleValue);
				if (err) {
					if (!errors[key]) {
						errors[key] = {
							errors: []
						};
					}
					errors[key].errors.push(err);
				}
			}
		});
	}
}

/**
 * @see Schema#validateSync
 */
function _validateSync(targetKey, attrs, options) {
	var errors = {},
		_this = this;

	try {
		// Validate present attributes
		utils.forOwn(attrs, function (value, key) {
			_executeRulesSync.call(_this, targetKey, options, errors, value, key);
		});
		// Validate missing attributes
		if (!options.ignoreMissing) {
			var schema = targetKey ? utils.get(_this.schema, targetKey) || {} : _this.schema,
				missing = utils.difference(utils.keys(schema), utils.keys(attrs));
			missing = utils.pick(this.schema, missing);
			missing = utils.map(missing, function () {
				return undefined;
			});
			utils.forOwn(missing, function (value, key) {
				_executeRulesSync.call(_this, targetKey, options, errors, value, key);
			});
		}
		if (!utils.isEmpty(errors)) {
			return errors;
		} else {
			return null;
		}
	} catch (err) {
		return err;
	}
}

function _executeRules(options, value, key, prefix, errors, deepQueue, ruleQueue) {
	var _this = this,
		nestedKey = prefix + key;

	if (utils.isObject(value)) {
		// Recurse down into nested attributes
		deepQueue[key] = (function (nK, val) {
			return function (next) {
				_validate.apply(_this, [nK, val, options, next]);
			};
		})(nestedKey, value);
	} else {
		var schemaRules = utils.get(_this.schema, nestedKey);
		if (!utils.isObject(schemaRules)) {
			return;
		} else if (schemaRules.nullable === true) {
			var nullable = rules.nullable || defaultRules.nullable,
				nErr = nullable(value, true);

			if (nErr === null) {
				return;
			}
		}
		utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
			var rule = rules[ruleKey] || defaultRules[ruleKey];
			// Asynchronous rules get added to the queue
			if (rule.async) {
				ruleQueue[ruleKey] = (function (r, key, val, rVal) {
					return function (next) {
						r(val, rVal, function (err) {
							next(null, { err: err, key: key });
						});
					};
				})(rule, key, value, ruleValue);
			} else {
				// Get results of synchronous rules immediately
				var err = rule(value, ruleValue);
				if (err) {
					if (!errors[key]) {
						errors[key] = {
							errors: []
						};
					}
					errors[key].errors.push(err);
				}
			}
		});
	}
}

/**
 * @see Schema#validate
 */
function _validate(targetKey, attrs, options, cb) {
	var errors = {},
		_this = this,
		prefix = targetKey + (targetKey.length ? '.' : ''),
		deepQueue = {},
		ruleQueue = {},
		first = options.first;

	delete options.first;

	utils.forOwn(attrs, function (value, key) {
		_executeRules.call(_this, options, value, key, prefix, errors, deepQueue, ruleQueue);
	});

	// Validate missing attributes
	if (!options.ignoreMissing) {
		var schema = targetKey ? utils.get(_this.schema, targetKey) || {} : _this.schema,
			missing = utils.difference(utils.keys(schema), utils.keys(attrs));

		missing = utils.pick(this.schema, missing);
		missing = utils.map(missing, function () {
			return undefined;
		});

		utils.forOwn(missing, function (value, key) {
			_executeRules.call(_this, options, value, key, prefix, errors, deepQueue, ruleQueue);
		});
	}

	var finalQueue = {};

	if (!utils.isEmpty(deepQueue)) {
		finalQueue.deepQueue = function (next) {
			_parallel(deepQueue, next);
		};
	}
	if (!utils.isEmpty(ruleQueue)) {
		finalQueue.ruleQueue = function (next) {
			_parallel(ruleQueue, next);
		};
	}

	if (!utils.isEmpty(finalQueue)) {
		_parallel(finalQueue, function (err, results) {

			// Merge results of recursion
			if (results.deepQueue) {
				results.deepQueue = utils.filter(results.deepQueue, function (x) {
					return x !== undefined && x !== null;
				});
				utils.deepMixIn(errors, results.deepQueue);
			}

			// Merge results of asynchronous rules
			if (results.ruleQueue) {
				if (results.ruleQueue) {
					results.ruleQueue = utils.filter(results.ruleQueue, function (x) {
						return x.err !== undefined && x.err !== null;
					});
				}
				utils.forOwn(results.ruleQueue, function (value) {
					if (!errors[value.key]) {
						errors[value.key] = {
							errors: []
						};
					}
					errors[value.key].errors.push(value.err);
				});
			}

			if (!utils.isEmpty(errors)) {
				first ? cb(errors) : cb(null, errors);
			} else {
				cb(null);
			}
		});
	} else {
		if (!utils.isEmpty(errors)) {
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
 * @method Schema#addDefaultsToTarget
 * @desc Add the default values for this Schema to the target object.
 * @param {object} target The target object to which to add the defaults.
 * rules.
 * @param {boolean=} overwrite Whether to overwrite existing values with the default values. Default: `false`.
 * @returns {object} The target with defaults merged in.
 */
Schema.prototype.addDefaultsToTarget = function (target, overwrite) {
	if (!utils.isObject(target)) {
		throw new Error('Schema#addDefaultsToTarget(target[, overwrite]): target: Must be an object!');
	} else if (!this.defaults) {
		throw new Error('Schema#addDefaultsToTarget(target[, overwrite]): this.defaults: This Schema has no defaults set!');
	} else if (overwrite) {
		utils.deepMixIn(target, this.defaults);
	} else {
		utils.deepFillIn(target, this.defaults);
	}
};

/**
 * @method Schema#setDefaults
 * @desc Set the default values for this Schema.
 * @param {object} attrs The default values for an object of this Schema.
 * @returns {Schema} Reference to this schema.
 */
Schema.prototype.setDefaults = function (attrs) {
	if (!utils.isObject(attrs)) {
		throw new Error('Schema#defaults(attrs): attrs: Must be an object!');
	} else {
		this.defaults = utils.merge({}, attrs);
	}
	return this;
};

/**
 * @method Schema#getDefaults
 * @desc Get the default values for this Schema.
 * @returns {object} The default values for this schema.
 */
Schema.prototype.getDefaults = function () {
	return utils.merge({}, this.defaults);
};

},{"../defaultRules":2,"../robocop/rule":6,"../rules":8,"../support/utils":10}],10:[function(_dereq_,module,exports){
module.exports = {
	isString: _dereq_('mout/lang/isString'),
	isBoolean: _dereq_('mout/lang/isBoolean'),
	isNumber: _dereq_('mout/lang/isNumber'),
	isObject: _dereq_('mout/lang/isObject'),
	isDate: _dereq_('mout/lang/isDate'),
	isFunction: _dereq_('mout/lang/isFunction'),
	isUndefined: _dereq_('mout/lang/isUndefined'),
	isArray: _dereq_('mout/lang/isArray'),
	isEmpty: _dereq_('mout/lang/isEmpty'),
	toString: _dereq_('mout/lang/toString'),
	toNumber: _dereq_('mout/lang/toNumber'),

	get: _dereq_('mout/object/get'),
	deepMixIn: _dereq_('mout/object/deepMixIn'),
	deepFillIn: _dereq_('mout/object/deepFillIn'),
	forOwn: _dereq_('mout/object/forOwn'),
	keys: _dereq_('mout/object/keys'),
	pick: _dereq_('mout/object/pick'),
	filter: _dereq_('mout/object/filter'),
	map: _dereq_('mout/object/map'),
	merge: _dereq_('mout/object/merge'),

	contains: _dereq_('mout/array/contains'),
	intersection: _dereq_('mout/array/intersection'),
	difference: _dereq_('mout/array/difference'),

	toInt: _dereq_('mout/number/toInt')
};

},{"mout/array/contains":11,"mout/array/difference":12,"mout/array/intersection":16,"mout/lang/isArray":25,"mout/lang/isBoolean":26,"mout/lang/isDate":27,"mout/lang/isEmpty":28,"mout/lang/isFunction":29,"mout/lang/isNumber":31,"mout/lang/isObject":32,"mout/lang/isString":34,"mout/lang/isUndefined":35,"mout/lang/toNumber":37,"mout/lang/toString":38,"mout/number/toInt":39,"mout/object/deepFillIn":40,"mout/object/deepMixIn":42,"mout/object/filter":43,"mout/object/forOwn":45,"mout/object/get":46,"mout/object/keys":48,"mout/object/map":49,"mout/object/merge":50,"mout/object/pick":52}],11:[function(_dereq_,module,exports){
var indexOf = _dereq_('./indexOf');

    /**
     * If array contains values.
     */
    function contains(arr, val) {
        return indexOf(arr, val) !== -1;
    }
    module.exports = contains;


},{"./indexOf":15}],12:[function(_dereq_,module,exports){
var unique = _dereq_('./unique');
var filter = _dereq_('./filter');
var some = _dereq_('./some');
var contains = _dereq_('./contains');
var slice = _dereq_('./slice');


    /**
     * Return a new Array with elements that aren't present in the other Arrays.
     */
    function difference(arr) {
        var arrs = slice(arguments, 1),
            result = filter(unique(arr), function(needle){
                return !some(arrs, function(haystack){
                    return contains(haystack, needle);
                });
            });
        return result;
    }

    module.exports = difference;



},{"./contains":11,"./filter":14,"./slice":17,"./some":18,"./unique":19}],13:[function(_dereq_,module,exports){
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Array every
     */
    function every(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = true;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (!callback(arr[i], i, arr) ) {
                result = false;
                break;
            }
        }

        return result;
    }

    module.exports = every;


},{"../function/makeIterator_":21}],14:[function(_dereq_,module,exports){
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Array filter
     */
    function filter(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    module.exports = filter;



},{"../function/makeIterator_":21}],15:[function(_dereq_,module,exports){


    /**
     * Array.indexOf
     */
    function indexOf(arr, item, fromIndex) {
        fromIndex = fromIndex || 0;
        if (arr == null) {
            return -1;
        }

        var len = arr.length,
            i = fromIndex < 0 ? len + fromIndex : fromIndex;
        while (i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (arr[i] === item) {
                return i;
            }

            i++;
        }

        return -1;
    }

    module.exports = indexOf;


},{}],16:[function(_dereq_,module,exports){
var unique = _dereq_('./unique');
var filter = _dereq_('./filter');
var every = _dereq_('./every');
var contains = _dereq_('./contains');
var slice = _dereq_('./slice');


    /**
     * Return a new Array with elements common to all Arrays.
     * - based on underscore.js implementation
     */
    function intersection(arr) {
        var arrs = slice(arguments, 1),
            result = filter(unique(arr), function(needle){
                return every(arrs, function(haystack){
                    return contains(haystack, needle);
                });
            });
        return result;
    }

    module.exports = intersection;



},{"./contains":11,"./every":13,"./filter":14,"./slice":17,"./unique":19}],17:[function(_dereq_,module,exports){


    /**
     * Create slice of source array or array-like object
     */
    function slice(arr, start, end){
        if (start == null) {
            start = 0;
        } else if (start < 0) {
            start = Math.max(arr.length + start, 0);
        }

        if (end == null) {
            end = arr.length;
        } else if (end < 0) {
            end = Math.max(arr.length + end, 0);
        }

        var result = [];
        while (start < end) {
            result.push(arr[start++]);
        }

        return result;
    }

    module.exports = slice;



},{}],18:[function(_dereq_,module,exports){
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Array some
     */
    function some(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = false;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback(arr[i], i, arr) ) {
                result = true;
                break;
            }
        }

        return result;
    }

    module.exports = some;


},{"../function/makeIterator_":21}],19:[function(_dereq_,module,exports){
var filter = _dereq_('./filter');

    /**
     * @return {array} Array of unique items
     */
    function unique(arr, compare){
        compare = compare || isEqual;
        return filter(arr, function(item, i, arr){
            var n = arr.length;
            while (++i < n) {
                if ( compare(item, arr[i]) ) {
                    return false;
                }
            }
            return true;
        });
    }

    function isEqual(a, b){
        return a === b;
    }

    module.exports = unique;



},{"./filter":14}],20:[function(_dereq_,module,exports){


    /**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    module.exports = identity;



},{}],21:[function(_dereq_,module,exports){
var identity = _dereq_('./identity');
var prop = _dereq_('./prop');
var deepMatches = _dereq_('../object/deepMatches');

    /**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator(src, thisObj){
        if (src == null) {
            return identity;
        }
        switch(typeof src) {
            case 'function':
                // function is the first to improve perf (most common case)
                // also avoid using `Function#call` if not needed, which boosts
                // perf a lot in some cases
                return (typeof thisObj !== 'undefined')? function(val, i, arr){
                    return src.call(thisObj, val, i, arr);
                } : src;
            case 'object':
                return function(val){
                    return deepMatches(val, src);
                };
            case 'string':
            case 'number':
                return prop(src);
        }
    }

    module.exports = makeIterator;



},{"../object/deepMatches":41,"./identity":20,"./prop":22}],22:[function(_dereq_,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],23:[function(_dereq_,module,exports){
var kindOf = _dereq_('./kindOf');
var isPlainObject = _dereq_('./isPlainObject');
var mixIn = _dereq_('../object/mixIn');

    /**
     * Clone native types.
     */
    function clone(val){
        switch (kindOf(val)) {
            case 'Object':
                return cloneObject(val);
            case 'Array':
                return cloneArray(val);
            case 'RegExp':
                return cloneRegExp(val);
            case 'Date':
                return cloneDate(val);
            default:
                return val;
        }
    }

    function cloneObject(source) {
        if (isPlainObject(source)) {
            return mixIn({}, source);
        } else {
            return source;
        }
    }

    function cloneRegExp(r) {
        var flags = '';
        flags += r.multiline ? 'm' : '';
        flags += r.global ? 'g' : '';
        flags += r.ignorecase ? 'i' : '';
        return new RegExp(r.source, flags);
    }

    function cloneDate(date) {
        return new Date(+date);
    }

    function cloneArray(arr) {
        return arr.slice();
    }

    module.exports = clone;



},{"../object/mixIn":51,"./isPlainObject":33,"./kindOf":36}],24:[function(_dereq_,module,exports){
var clone = _dereq_('./clone');
var forOwn = _dereq_('../object/forOwn');
var kindOf = _dereq_('./kindOf');
var isPlainObject = _dereq_('./isPlainObject');

    /**
     * Recursively clone native types.
     */
    function deepClone(val, instanceClone) {
        switch ( kindOf(val) ) {
            case 'Object':
                return cloneObject(val, instanceClone);
            case 'Array':
                return cloneArray(val, instanceClone);
            default:
                return clone(val);
        }
    }

    function cloneObject(source, instanceClone) {
        if (isPlainObject(source)) {
            var out = {};
            forOwn(source, function(val, key) {
                this[key] = deepClone(val, instanceClone);
            }, out);
            return out;
        } else if (instanceClone) {
            return instanceClone(source);
        } else {
            return source;
        }
    }

    function cloneArray(arr, instanceClone) {
        var out = [],
            i = -1,
            n = arr.length,
            val;
        while (++i < n) {
            out[i] = deepClone(arr[i], instanceClone);
        }
        return out;
    }

    module.exports = deepClone;




},{"../object/forOwn":45,"./clone":23,"./isPlainObject":33,"./kindOf":36}],25:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":30}],26:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isBoolean(val) {
        return isKind(val, 'Boolean');
    }
    module.exports = isBoolean;


},{"./isKind":30}],27:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isDate(val) {
        return isKind(val, 'Date');
    }
    module.exports = isDate;


},{"./isKind":30}],28:[function(_dereq_,module,exports){
var forOwn = _dereq_('../object/forOwn');
var isArray = _dereq_('./isArray');

    function isEmpty(val){
        if (val == null) {
            // typeof null == 'object' so we check it first
            return false;
        } else if ( typeof val === 'string' || isArray(val) ) {
            return !val.length;
        } else if ( typeof val === 'object' || typeof val === 'function' ) {
            var result = true;
            forOwn(val, function(){
                result = false;
                return false; // break loop
            });
            return result;
        } else {
            return false;
        }
    }

    module.exports = isEmpty;



},{"../object/forOwn":45,"./isArray":25}],29:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":30}],30:[function(_dereq_,module,exports){
var kindOf = _dereq_('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":36}],31:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isNumber(val) {
        return isKind(val, 'Number');
    }
    module.exports = isNumber;


},{"./isKind":30}],32:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":30}],33:[function(_dereq_,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],34:[function(_dereq_,module,exports){
var isKind = _dereq_('./isKind');
    /**
     */
    function isString(val) {
        return isKind(val, 'String');
    }
    module.exports = isString;


},{"./isKind":30}],35:[function(_dereq_,module,exports){

    var UNDEF;

    /**
     */
    function isUndef(val){
        return val === UNDEF;
    }
    module.exports = isUndef;


},{}],36:[function(_dereq_,module,exports){


    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    module.exports = kindOf;


},{}],37:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray');

    /**
     * covert value into number if numeric
     */
    function toNumber(val){
        // numberic values should come first because of -0
        if (typeof val === 'number') return val;
        // we want all falsy values (besides -0) to return zero to avoid
        // headaches
        if (!val) return 0;
        if (typeof val === 'string') return parseFloat(val);
        // arrays are edge cases. `Number([4]) === 4`
        if (isArray(val)) return NaN;
        return Number(val);
    }

    module.exports = toNumber;



},{"./isArray":25}],38:[function(_dereq_,module,exports){


    /**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    module.exports = toString;



},{}],39:[function(_dereq_,module,exports){


    /**
     * "Convert" value into an 32-bit integer.
     * Works like `Math.floor` if val > 0 and `Math.ceil` if val < 0.
     * IMPORTANT: val will wrap at 2^31 and -2^31.
     * Perf tests: http://jsperf.com/vs-vs-parseint-bitwise-operators/7
     */
    function toInt(val){
        // we do not use lang/toNumber because of perf and also because it
        // doesn't break the functionality
        return ~~val;
    }

    module.exports = toInt;



},{}],40:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var isPlainObject = _dereq_('../lang/isPlainObject');

    /**
     * Deeply copy missing properties in the target from the defaults.
     */
    function deepFillIn(target, defaults){
        var i = 0,
            n = arguments.length,
            obj;

        while(++i < n) {
            obj = arguments[i];
            if (obj) {
                // jshint loopfunc: true
                forOwn(obj, function(newValue, key) {
                    var curValue = target[key];
                    if (curValue == null) {
                        target[key] = newValue;
                    } else if (isPlainObject(curValue) &&
                               isPlainObject(newValue)) {
                        deepFillIn(curValue, newValue);
                    }
                });
            }
        }

        return target;
    }

    module.exports = deepFillIn;



},{"../lang/isPlainObject":33,"./forOwn":45}],41:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var isArray = _dereq_('../lang/isArray');

    function containsMatch(array, pattern) {
        var i = -1, length = array.length;
        while (++i < length) {
            if (deepMatches(array[i], pattern)) {
                return true;
            }
        }

        return false;
    }

    function matchArray(target, pattern) {
        var i = -1, patternLength = pattern.length;
        while (++i < patternLength) {
            if (!containsMatch(target, pattern[i])) {
                return false;
            }
        }

        return true;
    }

    function matchObject(target, pattern) {
        var result = true;
        forOwn(pattern, function(val, key) {
            if (!deepMatches(target[key], val)) {
                // Return false to break out of forOwn early
                return (result = false);
            }
        });

        return result;
    }

    /**
     * Recursively check if the objects match.
     */
    function deepMatches(target, pattern){
        if (target && typeof target === 'object') {
            if (isArray(target) && isArray(pattern)) {
                return matchArray(target, pattern);
            } else {
                return matchObject(target, pattern);
            }
        } else {
            return target === pattern;
        }
    }

    module.exports = deepMatches;



},{"../lang/isArray":25,"./forOwn":45}],42:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var isPlainObject = _dereq_('../lang/isPlainObject');

    /**
     * Mixes objects into the target object, recursively mixing existing child
     * objects.
     */
    function deepMixIn(target, objects) {
        var i = 0,
            n = arguments.length,
            obj;

        while(++i < n){
            obj = arguments[i];
            if (obj) {
                forOwn(obj, copyProp, target);
            }
        }

        return target;
    }

    function copyProp(val, key) {
        var existing = this[key];
        if (isPlainObject(val) && isPlainObject(existing)) {
            deepMixIn(existing, val);
        } else {
            this[key] = val;
        }
    }

    module.exports = deepMixIn;



},{"../lang/isPlainObject":33,"./forOwn":45}],43:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Creates a new object with all the properties where the callback returns
     * true.
     */
    function filterValues(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var output = {};
        forOwn(obj, function(value, key, obj) {
            if (callback(value, key, obj)) {
                output[key] = value;
            }
        });

        return output;
    }
    module.exports = filterValues;


},{"../function/makeIterator_":21,"./forOwn":45}],44:[function(_dereq_,module,exports){
var hasOwn = _dereq_('./hasOwn');

    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }


        if (_hasDontEnumBug) {
            var ctor = obj.constructor,
                isProto = !!ctor && obj === ctor.prototype;

            while (key = _dontEnums[i++]) {
                // For constructor, if it is a prototype object the constructor
                // is always non-enumerable unless defined otherwise (and
                // enumerated above).  For non-prototype objects, it will have
                // to be defined on this object, since it cannot be defined on
                // any prototype objects.
                //
                // For other [[DontEnum]] properties, check if the value is
                // different than Object prototype value.
                if (
                    (key !== 'constructor' ||
                        (!isProto && hasOwn(obj, key))) &&
                    obj[key] !== Object.prototype[key]
                ) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    module.exports = forIn;



},{"./hasOwn":47}],45:[function(_dereq_,module,exports){
var hasOwn = _dereq_('./hasOwn');
var forIn = _dereq_('./forIn');

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    module.exports = forOwn;



},{"./forIn":44,"./hasOwn":47}],46:[function(_dereq_,module,exports){


    /**
     * get "nested" object property
     */
    function get(obj, prop){
        var parts = prop.split('.'),
            last = parts.pop();

        while (prop = parts.shift()) {
            obj = obj[prop];
            if (typeof obj !== 'object' || !obj) return;
        }

        return obj[last];
    }

    module.exports = get;



},{}],47:[function(_dereq_,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],48:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');

    /**
     * Get object keys
     */
     var keys = Object.keys || function (obj) {
            var keys = [];
            forOwn(obj, function(val, key){
                keys.push(key);
            });
            return keys;
        };

    module.exports = keys;



},{"./forOwn":45}],49:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');
var makeIterator = _dereq_('../function/makeIterator_');

    /**
     * Creates a new object where all the values are the result of calling
     * `callback`.
     */
    function mapValues(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var output = {};
        forOwn(obj, function(val, key, obj) {
            output[key] = callback(val, key, obj);
        });

        return output;
    }
    module.exports = mapValues;


},{"../function/makeIterator_":21,"./forOwn":45}],50:[function(_dereq_,module,exports){
var hasOwn = _dereq_('./hasOwn');
var deepClone = _dereq_('../lang/deepClone');
var isObject = _dereq_('../lang/isObject');

    /**
     * Deep merge objects.
     */
    function merge() {
        var i = 1,
            key, val, obj, target;

        // make sure we don't modify source element and it's properties
        // objects are passed by reference
        target = deepClone( arguments[0] );

        while (obj = arguments[i++]) {
            for (key in obj) {
                if ( ! hasOwn(obj, key) ) {
                    continue;
                }

                val = obj[key];

                if ( isObject(val) && isObject(target[key]) ){
                    // inception, deep merge objects
                    target[key] = merge(target[key], val);
                } else {
                    // make sure arrays, regexp, date, objects are cloned
                    target[key] = deepClone(val);
                }

            }
        }

        return target;
    }

    module.exports = merge;



},{"../lang/deepClone":24,"../lang/isObject":32,"./hasOwn":47}],51:[function(_dereq_,module,exports){
var forOwn = _dereq_('./forOwn');

    /**
    * Combine properties from all the objects into first one.
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
    * @param {object} target    Target Object
    * @param {...object} objects    Objects to be combined (0...n objects).
    * @return {object} Target Object.
    */
    function mixIn(target, objects){
        var i = 0,
            n = arguments.length,
            obj;
        while(++i < n){
            obj = arguments[i];
            if (obj != null) {
                forOwn(obj, copyProp, target);
            }
        }
        return target;
    }

    function copyProp(val, key){
        this[key] = val;
    }

    module.exports = mixIn;


},{"./forOwn":45}],52:[function(_dereq_,module,exports){
var slice = _dereq_('../array/slice');

    /**
     * Return a copy of the object, filtered to only have values for the whitelisted keys.
     */
    function pick(obj, var_keys){
        var keys = typeof arguments[1] !== 'string'? arguments[1] : slice(arguments, 1),
            out = {},
            i = 0, key;
        while (key = keys[i++]) {
            out[key] = obj[key];
        }
        return out;
    }

    module.exports = pick;



},{"../array/slice":17}]},{},[3])
(3)
});
