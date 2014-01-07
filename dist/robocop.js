/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.11.1 - Homepage <http://jmdobry.github.io/robocop.js/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>
 * @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>
 *
 * @overview Define and validate rules, datatypes and schemata in Node and in the browser.
 */
!function(o){"object"==typeof exports?module.exports=o():"function"==typeof define&&define.amd?define(o):"undefined"!=typeof window?window.robocop=o():"undefined"!=typeof global?global.robocop=o():"undefined"!=typeof self&&(self.robocop=o())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var utils = require('../support/utils');

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

},{"../support/utils":9}],2:[function(require,module,exports){
'use strict';

module.exports = require('./robocop');

},{"./robocop":4}],3:[function(require,module,exports){
'use strict';

var utils = require('../support/utils');

var defaultDataTypes = require('../dataType');

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

},{"../dataType":1,"../support/utils":9}],4:[function(require,module,exports){
'use strict';

var utils = require('../support/utils');

var robocop = module.exports = {
	Schema: require('../schema')
};

utils.deepMixIn(robocop, require('./schema'));
utils.deepMixIn(robocop, require('./rule'));
utils.deepMixIn(robocop, require('./dataType'));

},{"../schema":8,"../support/utils":9,"./dataType":3,"./rule":5,"./schema":6}],5:[function(require,module,exports){
'use strict';

var utils = require('../support/utils');

var defaultRules = require('../rule');

var rules = {};

module.exports = {
	defineRule: function (name, ruleFunc) {
		if (!utils.isString(name)) {
			throw new Error('robocop.defineRule(name, ruleFunc): name: Must be a string!');
		} else if (!utils.isFunction(ruleFunc)) {
			throw new Error('robocop.defineRule(name, ruleFunc): ruleFunc: Must be a function!');
		} else if (rules[name]) {
			throw new Error('robocop.defineRule(name, ruleFunc): name: Name already in use!');
		}
		rules[name] = ruleFunc;
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

},{"../rule":7,"../support/utils":9}],6:[function(require,module,exports){
'use strict';

var utils = require('../support/utils'),
	Schema = require('../schema');

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

},{"../schema":8,"../support/utils":9}],7:[function(require,module,exports){
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

},{"../dataType":1,"../support/utils":9}],8:[function(require,module,exports){
'use strict';

var utils = require('../support/utils'),
	rules = require('../rule');

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
		_parallel(queue, function (err, results) {

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

},{"../rule":7,"../support/utils":9}],9:[function(require,module,exports){
module.exports = {
	isString: require('mout/lang/isString'),
	isBoolean: require('mout/lang/isBoolean'),
	isNumber: require('mout/lang/isNumber'),
	isObject: require('mout/lang/isObject'),
	isDate: require('mout/lang/isDate'),
	isFunction: require('mout/lang/isFunction'),
	isUndefined: require('mout/lang/isUndefined'),
	isArray: require('mout/lang/isArray'),
	isEmpty: require('mout/lang/isEmpty'),
	toString: require('mout/lang/toString'),
	toNumber: require('mout/lang/toNumber'),

	get: require('mout/object/get'),
	deepMixIn: require('mout/object/deepMixIn'),
	forOwn: require('mout/object/forOwn'),
	keys: require('mout/object/keys'),
	filter: require('mout/object/filter'),

	toInt: require('mout/number/toInt')
};

},{"mout/lang/isArray":13,"mout/lang/isBoolean":14,"mout/lang/isDate":15,"mout/lang/isEmpty":16,"mout/lang/isFunction":17,"mout/lang/isNumber":19,"mout/lang/isObject":20,"mout/lang/isString":22,"mout/lang/isUndefined":23,"mout/lang/toNumber":25,"mout/lang/toString":26,"mout/number/toInt":27,"mout/object/deepMixIn":29,"mout/object/filter":30,"mout/object/forOwn":32,"mout/object/get":33,"mout/object/keys":35}],10:[function(require,module,exports){


    /**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    module.exports = identity;



},{}],11:[function(require,module,exports){
var identity = require('./identity');
var prop = require('./prop');
var deepMatches = require('../object/deepMatches');

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



},{"../object/deepMatches":28,"./identity":10,"./prop":12}],12:[function(require,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],13:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":18}],14:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isBoolean(val) {
        return isKind(val, 'Boolean');
    }
    module.exports = isBoolean;


},{"./isKind":18}],15:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isDate(val) {
        return isKind(val, 'Date');
    }
    module.exports = isDate;


},{"./isKind":18}],16:[function(require,module,exports){
var forOwn = require('../object/forOwn');
var isArray = require('./isArray');

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



},{"../object/forOwn":32,"./isArray":13}],17:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":18}],18:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":24}],19:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isNumber(val) {
        return isKind(val, 'Number');
    }
    module.exports = isNumber;


},{"./isKind":18}],20:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":18}],21:[function(require,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],22:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isString(val) {
        return isKind(val, 'String');
    }
    module.exports = isString;


},{"./isKind":18}],23:[function(require,module,exports){

    var UNDEF;

    /**
     */
    function isUndef(val){
        return val === UNDEF;
    }
    module.exports = isUndef;


},{}],24:[function(require,module,exports){


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


},{}],25:[function(require,module,exports){
var isArray = require('./isArray');

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



},{"./isArray":13}],26:[function(require,module,exports){


    /**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    module.exports = toString;



},{}],27:[function(require,module,exports){


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



},{}],28:[function(require,module,exports){
var forOwn = require('./forOwn');
var isArray = require('../lang/isArray');

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



},{"../lang/isArray":13,"./forOwn":32}],29:[function(require,module,exports){
var forOwn = require('./forOwn');
var isPlainObject = require('../lang/isPlainObject');

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



},{"../lang/isPlainObject":21,"./forOwn":32}],30:[function(require,module,exports){
var forOwn = require('./forOwn');
var makeIterator = require('../function/makeIterator_');

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


},{"../function/makeIterator_":11,"./forOwn":32}],31:[function(require,module,exports){


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
            while (key = _dontEnums[i++]) {
                // since we aren't using hasOwn check we need to make sure the
                // property was overwritten
                if (obj[key] !== Object.prototype[key]) {
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



},{}],32:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var forIn = require('./forIn');

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



},{"./forIn":31,"./hasOwn":34}],33:[function(require,module,exports){


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



},{}],34:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],35:[function(require,module,exports){
var forOwn = require('./forOwn');

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



},{"./forOwn":32}]},{},[2])
(2)
});
;
