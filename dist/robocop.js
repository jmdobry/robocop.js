/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.11.0 - Homepage <http://jmdobry.github.io/robocop.js/>
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

},{"../dataType":1,"../support/utils":9}],8:[function(require,module,exports){
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

},{"../rule":7,"../support/utils":9,"async":10}],9:[function(require,module,exports){
module.exports = {
	forEach: require('mout/array/forEach'),

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
	set: require('mout/object/set'),
	unset: require('mout/object/unset'),
	deepMixIn: require('mout/object/deepMixIn'),
	forOwn: require('mout/object/forOwn'),
	keys: require('mout/object/keys'),
	filter: require('mout/object/filter'),

	toInt: require('mout/number/toInt')
};

},{"mout/array/forEach":12,"mout/lang/isArray":16,"mout/lang/isBoolean":17,"mout/lang/isDate":18,"mout/lang/isEmpty":19,"mout/lang/isFunction":20,"mout/lang/isNumber":22,"mout/lang/isObject":23,"mout/lang/isString":25,"mout/lang/isUndefined":26,"mout/lang/toNumber":28,"mout/lang/toString":29,"mout/number/toInt":30,"mout/object/deepMixIn":32,"mout/object/filter":33,"mout/object/forOwn":35,"mout/object/get":36,"mout/object/keys":39,"mout/object/set":41,"mout/object/unset":42}],10:[function(require,module,exports){
var process=require("__browserify_process");/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = setImmediate;
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

},{"__browserify_process":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],12:[function(require,module,exports){


    /**
     * Array forEach
     */
    function forEach(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    module.exports = forEach;



},{}],13:[function(require,module,exports){


    /**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    module.exports = identity;



},{}],14:[function(require,module,exports){
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



},{"../object/deepMatches":31,"./identity":13,"./prop":15}],15:[function(require,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],16:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":21}],17:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isBoolean(val) {
        return isKind(val, 'Boolean');
    }
    module.exports = isBoolean;


},{"./isKind":21}],18:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isDate(val) {
        return isKind(val, 'Date');
    }
    module.exports = isDate;


},{"./isKind":21}],19:[function(require,module,exports){
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



},{"../object/forOwn":35,"./isArray":16}],20:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":21}],21:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":27}],22:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isNumber(val) {
        return isKind(val, 'Number');
    }
    module.exports = isNumber;


},{"./isKind":21}],23:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":21}],24:[function(require,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],25:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isString(val) {
        return isKind(val, 'String');
    }
    module.exports = isString;


},{"./isKind":21}],26:[function(require,module,exports){

    var UNDEF;

    /**
     */
    function isUndef(val){
        return val === UNDEF;
    }
    module.exports = isUndef;


},{}],27:[function(require,module,exports){


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


},{}],28:[function(require,module,exports){
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



},{"./isArray":16}],29:[function(require,module,exports){


    /**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    module.exports = toString;



},{}],30:[function(require,module,exports){


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



},{}],31:[function(require,module,exports){
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



},{"../lang/isArray":16,"./forOwn":35}],32:[function(require,module,exports){
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



},{"../lang/isPlainObject":24,"./forOwn":35}],33:[function(require,module,exports){
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


},{"../function/makeIterator_":14,"./forOwn":35}],34:[function(require,module,exports){


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



},{}],35:[function(require,module,exports){
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



},{"./forIn":34,"./hasOwn":38}],36:[function(require,module,exports){


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



},{}],37:[function(require,module,exports){
var get = require('./get');

    var UNDEF;

    /**
     * Check if object has nested property.
     */
    function has(obj, prop){
        return get(obj, prop) !== UNDEF;
    }

    module.exports = has;




},{"./get":36}],38:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],39:[function(require,module,exports){
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



},{"./forOwn":35}],40:[function(require,module,exports){
var forEach = require('../array/forEach');

    /**
     * Create nested object if non-existent
     */
    function namespace(obj, path){
        if (!path) return obj;
        forEach(path.split('.'), function(key){
            if (!obj[key]) {
                obj[key] = {};
            }
            obj = obj[key];
        });
        return obj;
    }

    module.exports = namespace;



},{"../array/forEach":12}],41:[function(require,module,exports){
var namespace = require('./namespace');

    /**
     * set "nested" object property
     */
    function set(obj, prop, val){
        var parts = (/^(.+)\.(.+)$/).exec(prop);
        if (parts){
            namespace(obj, parts[1])[parts[2]] = val;
        } else {
            obj[prop] = val;
        }
    }

    module.exports = set;



},{"./namespace":40}],42:[function(require,module,exports){
var has = require('./has');

    /**
     * Unset object property.
     */
    function unset(obj, prop){
        if (has(obj, prop)) {
            var parts = prop.split('.'),
                last = parts.pop();
            while (prop = parts.shift()) {
                obj = obj[prop];
            }
            return (delete obj[last]);

        } else {
            // if property doesn't exist treat as deleted
            return true;
        }
    }

    module.exports = unset;



},{"./has":37}]},{},[2])
(2)
});
;
