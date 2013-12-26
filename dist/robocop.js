/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.9.0 - Homepage <http://jmdobry.github.io/robocop.js/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>
 * @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>
 *
 * @overview Define and validate rules, datatypes and schemata in Node and in the browser.
 */
!function(o){"object"==typeof exports?module.exports=o():"function"==typeof define&&define.amd?define(o):"undefined"!=typeof window?window.robocop=o():"undefined"!=typeof global?global.robocop=o():"undefined"!=typeof self&&(self.robocop=o())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var lang = require('mout/lang'),
	toInt = require('mout/number/toInt');

module.exports = {
	'string': lang.isString,
	'number': lang.isNumber,
	'integer': function (x) {
		if (!lang.isNumber(x)) {
			return false;
		}
		return Math.abs(x) - Math.abs(toInt(x)) === 0;
	},
	'float': lang.isNumber,
	'array': lang.isArray,
	'object': lang.isObject,
	'boolean': lang.isBoolean,
	'date': lang.isDate
};
},{"mout/lang":21,"mout/number/toInt":52}],2:[function(require,module,exports){
'use strict';

module.exports = require('./robocop');

},{"./robocop":4}],3:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	keys = require('mout/object/keys');

var defaultDataTypes = require('../dataType');

var dataTypes = {};

module.exports = {
	defineDataType: function (name, typeDefinition) {
		if (!isString(name)) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Must be a string!');
		}
		if (dataTypes[name]) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Name already in use!');
		}
		dataTypes[name] = typeDefinition;
	},

	hasDataType: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.hasDataType(name): name: Must be a string!');
		}
		return !!(dataTypes[name] || defaultDataTypes[name]);
	},

	getDataType: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.getDataType(name): name: Must be a string!');
		}
		return dataTypes[name] || defaultDataTypes[name];
	},

	availableDataTypes: function () {
		return keys(dataTypes).concat(keys(defaultDataTypes));
	},

	testDataType: function (name, value) {
		if (!isString(name)) {
			throw new Error('robocop.testDataType(name, value): name: Must be a string!');
		} else if (!(dataTypes[name] || defaultDataTypes[name])) {
			throw new Error('robocop.testDataType(name, value): name: No dataType with that name exists!');
		}
		return dataTypes[name] ? dataTypes[name](value) : defaultDataTypes[name](value);
	},

	removeDataType: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.removeDataType(name): name: Must be a string!');
		}
		if (dataTypes[name]) {
			delete dataTypes[name];
		}
	}
};

},{"../dataType":1,"mout/lang/isString":44,"mout/object/keys":71}],4:[function(require,module,exports){
'use strict';

var deepMixIn = require('mout/object/deepMixIn');

var robocop = module.exports = {
	Schema: require('../schema'),
	defaultRules: require('../rule'),
	defaultDataTypes: require('../dataType')
};

deepMixIn(robocop, require('./schema'));
deepMixIn(robocop, require('./rule'));
deepMixIn(robocop, require('./dataType'));

},{"../dataType":1,"../rule":7,"../schema":8,"./dataType":3,"./rule":5,"./schema":6,"mout/object/deepMixIn":59}],5:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	keys = require('mout/object/keys');

var defaultRules = require('../rule');

var rules = {};

module.exports = {
	defineRule: function (name, ruleFunc) {
		if (rules[name]) {
			throw new Error('robocop.defineRule(name, ruleFunc): name: Name already in use!');
		}
		rules[name] = ruleFunc;
	},

	hasRule: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.hasRule(name): name: Must be a string!');
		}
		return !!rules[name];
	},

	getRule: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.getRule(name): name: Must be a string!');
		}
		return rules[name];
	},

	availableRules: function () {
		return keys(rules).concat(keys(defaultRules));
	},

	testRule: function (name, value, options) {
		if (!isString(name)) {
			throw new Error('robocop.testRule(name, value, options): name: Must be a string!');
		} else if (!rules[name] && !defaultRules[name]) {
			throw new Error('robocop.testRule(name, value, options): name: No rule with that name exists!');
		}
		return rules[name] ? rules[name](value, options) : defaultRules[name](value, options);
	},

	removeRule: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.removeRule(name): name: Must be a string!');
		}
		if (rules[name]) {
			delete rules[name];
		}
	}
};

},{"../rule":7,"mout/lang/isString":44,"mout/object/keys":71}],6:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	isObject = require('mout/lang/isObject'),
	keys = require('mout/object/keys'),
	Schema = require('../schema');

var schemas = {};

module.exports = {
	defineSchema: function (name, schema) {
		if (schemas[name]) {
			throw new Error('robocop.defineSchema(name, schema): name: Name already in use!');
		}
		schemas[name] = new Schema(name, schema);
		return schemas[name];
	},

	hasSchema: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.hasSchema(name): name: Must be a string!');
		}
		return !!schemas[name];
	},

	getSchema: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.getSchema(name): name: Must be a string!');
		}
		return schemas[name];
	},

	availableSchemas: function () {
		return keys(schemas);
	},

	testSchema: function (attrs, options) {
		if (!isObject(attrs)) {
			throw new Error('robocop.testSchema(attrs, options, cb): attrs: Must be an object!');
		} else if (!isObject(options)) {
			throw new Error('robocop.testSchema(attrs, options, cb): options: Must be an object!');
		} else if (!schemas[options.name]) {
			throw new Error('robocop.testSchema(attrs, options, cb): options.name: No schema with that name exists!');
		}
		return schemas[options.name].validate(attrs, options);
	},

	removeSchema: function (name) {
		if (!isString(name)) {
			throw new Error('robocop.removeSchema(name): name: Must be a string!');
		}
		if (schemas[name]) {
			delete schemas[name];
		}
	}
};

},{"../schema":8,"mout/lang/isObject":41,"mout/lang/isString":44,"mout/object/keys":71}],7:[function(require,module,exports){
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
},{"../dataType":1,"mout/lang":21}],8:[function(require,module,exports){
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

},{"../rule":7,"async":9,"mout/lang":21,"mout/object":53}],9:[function(require,module,exports){
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

},{"__browserify_process":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var findIndex = require('./findIndex');

    /**
     * Returns first item that matches criteria
     */
    function find(arr, iterator, thisObj){
        var idx = findIndex(arr, iterator, thisObj);
        return idx >= 0? arr[idx] : void(0);
    }

    module.exports = find;



},{"./findIndex":12}],12:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Returns the index of the first item that matches criteria
     */
    function findIndex(arr, iterator, thisObj){
        iterator = makeIterator(iterator, thisObj);
        if (arr == null) {
            return -1;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            if (iterator(arr[i], i, arr)) {
                return i;
            }
        }

        return -1;
    }

    module.exports = findIndex;


},{"../function/makeIterator_":19}],13:[function(require,module,exports){


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



},{}],14:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Return maximum value inside array
     */
    function max(arr, iterator, thisObj){
        if (arr == null || !arr.length) {
            return Infinity;
        } else if (arr.length && !iterator) {
            return Math.max.apply(Math, arr);
        } else {
            iterator = makeIterator(iterator, thisObj);
            var result,
                compare = -Infinity,
                value,
                temp;

            var i = -1, len = arr.length;
            while (++i < len) {
                value = arr[i];
                temp = iterator(value, i, arr);
                if (temp > compare) {
                    compare = temp;
                    result = value;
                }
            }

            return result;
        }
    }

    module.exports = max;



},{"../function/makeIterator_":19}],15:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Return minimum value inside array
     */
    function min(arr, iterator, thisObj){
        if (arr == null || !arr.length) {
            return -Infinity;
        } else if (arr.length && !iterator) {
            return Math.min.apply(Math, arr);
        } else {
            iterator = makeIterator(iterator, thisObj);
            var result,
                compare = Infinity,
                value,
                temp;

            var i = -1, len = arr.length;
            while (++i < len) {
                value = arr[i];
                temp = iterator(value, i, arr);
                if (temp < compare) {
                    compare = temp;
                    result = value;
                }
            }

            return result;
        }
    }

    module.exports = min;



},{"../function/makeIterator_":19}],16:[function(require,module,exports){


    var arrSlice = Array.prototype.slice;

    /**
     * Create slice of source array or array-like object
     */
    function slice(arr, start, end){
        return arrSlice.call(arr, start, end);
    }

    module.exports = slice;



},{}],17:[function(require,module,exports){
var slice = require('../array/slice');

    /**
     * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
     * @param {Function} fn  Function.
     * @param {object} context   Execution context.
     * @param {rest} args    Arguments (0...n arguments).
     * @return {Function} Wrapped Function.
     */
    function bind(fn, context, args){
        var argsArr = slice(arguments, 2); //curried args
        return function(){
            return fn.apply(context, argsArr.concat(slice(arguments)));
        };
    }

    module.exports = bind;



},{"../array/slice":16}],18:[function(require,module,exports){


    /**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    module.exports = identity;



},{}],19:[function(require,module,exports){
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



},{"../object/deepMatches":58,"./identity":18,"./prop":20}],20:[function(require,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],21:[function(require,module,exports){


//automatically generated, do not edit!
//run `node build` instead
module.exports = {
    'clone' : require('./lang/clone'),
    'createObject' : require('./lang/createObject'),
    'ctorApply' : require('./lang/ctorApply'),
    'deepClone' : require('./lang/deepClone'),
    'defaults' : require('./lang/defaults'),
    'inheritPrototype' : require('./lang/inheritPrototype'),
    'is' : require('./lang/is'),
    'isArguments' : require('./lang/isArguments'),
    'isArray' : require('./lang/isArray'),
    'isBoolean' : require('./lang/isBoolean'),
    'isDate' : require('./lang/isDate'),
    'isEmpty' : require('./lang/isEmpty'),
    'isFinite' : require('./lang/isFinite'),
    'isFunction' : require('./lang/isFunction'),
    'isInteger' : require('./lang/isInteger'),
    'isKind' : require('./lang/isKind'),
    'isNaN' : require('./lang/isNaN'),
    'isNull' : require('./lang/isNull'),
    'isNumber' : require('./lang/isNumber'),
    'isObject' : require('./lang/isObject'),
    'isPlainObject' : require('./lang/isPlainObject'),
    'isRegExp' : require('./lang/isRegExp'),
    'isString' : require('./lang/isString'),
    'isUndefined' : require('./lang/isUndefined'),
    'isnt' : require('./lang/isnt'),
    'kindOf' : require('./lang/kindOf'),
    'toArray' : require('./lang/toArray'),
    'toNumber' : require('./lang/toNumber'),
    'toString' : require('./lang/toString')
};



},{"./lang/clone":22,"./lang/createObject":23,"./lang/ctorApply":24,"./lang/deepClone":25,"./lang/defaults":26,"./lang/inheritPrototype":27,"./lang/is":28,"./lang/isArguments":29,"./lang/isArray":30,"./lang/isBoolean":31,"./lang/isDate":32,"./lang/isEmpty":33,"./lang/isFinite":34,"./lang/isFunction":35,"./lang/isInteger":36,"./lang/isKind":37,"./lang/isNaN":38,"./lang/isNull":39,"./lang/isNumber":40,"./lang/isObject":41,"./lang/isPlainObject":42,"./lang/isRegExp":43,"./lang/isString":44,"./lang/isUndefined":45,"./lang/isnt":46,"./lang/kindOf":47,"./lang/toArray":48,"./lang/toNumber":49,"./lang/toString":50}],22:[function(require,module,exports){
var kindOf = require('./kindOf');
var isPlainObject = require('./isPlainObject');
var mixIn = require('../object/mixIn');

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



},{"../object/mixIn":77,"./isPlainObject":42,"./kindOf":47}],23:[function(require,module,exports){
var mixIn = require('../object/mixIn');

    /**
     * Create Object using prototypal inheritance and setting custom properties.
     * - Mix between Douglas Crockford Prototypal Inheritance <http://javascript.crockford.com/prototypal.html> and the EcmaScript 5 `Object.create()` method.
     * @param {object} parent    Parent Object.
     * @param {object} [props] Object properties.
     * @return {object} Created object.
     */
    function createObject(parent, props){
        function F(){}
        F.prototype = parent;
        return mixIn(new F(), props);

    }
    module.exports = createObject;



},{"../object/mixIn":77}],24:[function(require,module,exports){


    function F(){}

    /**
     * Do fn.apply on a constructor.
     */
    function ctorApply(ctor, args) {
        F.prototype = ctor.prototype;
        var instance = new F();
        ctor.apply(instance, args);
        return instance;
    }

    module.exports = ctorApply;



},{}],25:[function(require,module,exports){
var clone = require('./clone');
var forOwn = require('../object/forOwn');
var kindOf = require('./kindOf');
var isPlainObject = require('./isPlainObject');

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




},{"../object/forOwn":66,"./clone":22,"./isPlainObject":42,"./kindOf":47}],26:[function(require,module,exports){
var toArray = require('./toArray');
var find = require('../array/find');

    /**
     * Return first non void argument
     */
    function defaults(var_args){
        return find(toArray(arguments), nonVoid);
    }

    function nonVoid(val){
        return val != null;
    }

    module.exports = defaults;



},{"../array/find":11,"./toArray":48}],27:[function(require,module,exports){
var createObject = require('./createObject');

    /**
    * Inherit prototype from another Object.
    * - inspired by Nicholas Zackas <http://nczonline.net> Solution
    * @param {object} child Child object
    * @param {object} parent    Parent Object
    */
    function inheritPrototype(child, parent){
        var p = createObject(parent.prototype);
        p.constructor = child;
        child.prototype = p;
        child.super_ = parent;
    }

    module.exports = inheritPrototype;


},{"./createObject":23}],28:[function(require,module,exports){


    /**
     * Check if both arguments are egal.
     */
    function is(x, y){
        // implementation borrowed from harmony:egal spec
        if (x === y) {
          // 0 === -0, but they are not identical
          return x !== 0 || 1 / x === 1 / y;
        }

        // NaN !== NaN, but they are identical.
        // NaNs are the only non-reflexive value, i.e., if x !== x,
        // then x is a NaN.
        // isNaN is broken: it converts its argument to number, so
        // isNaN("foo") => true
        return x !== x && y !== y;
    }

    module.exports = is;



},{}],29:[function(require,module,exports){
var isKind = require('./isKind');

    /**
     */
    var isArgs = isKind(arguments, 'Arguments')?
            function(val){
                return isKind(val, 'Arguments');
            } :
            function(val){
                // Arguments is an Object on IE7
                return !!(val && Object.prototype.hasOwnProperty.call(val, 'callee'));
            };

    module.exports = isArgs;


},{"./isKind":37}],30:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":37}],31:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isBoolean(val) {
        return isKind(val, 'Boolean');
    }
    module.exports = isBoolean;


},{"./isKind":37}],32:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isDate(val) {
        return isKind(val, 'Date');
    }
    module.exports = isDate;


},{"./isKind":37}],33:[function(require,module,exports){
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



},{"../object/forOwn":66,"./isArray":30}],34:[function(require,module,exports){
var isNumber = require('./isNumber');

    var global = this;

    /**
     * Check if value is finite
     */
    function isFinite(val){
        var is = false;
        if (typeof val === 'string' && val !== '') {
            is = global.isFinite( parseFloat(val) );
        } else if (isNumber(val)){
            // need to use isNumber because of Number constructor
            is = global.isFinite( val );
        }
        return is;
    }

    module.exports = isFinite;



},{"./isNumber":40}],35:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":37}],36:[function(require,module,exports){
var isNumber = require('./isNumber');

    /**
     * Check if value is an integer
     */
    function isInteger(val){
        return isNumber(val) && (val % 1 === 0);
    }

    module.exports = isInteger;



},{"./isNumber":40}],37:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":47}],38:[function(require,module,exports){
var isNumber = require('./isNumber');
var $isNaN = require('../number/isNaN');

    /**
     * Check if value is NaN for realz
     */
    function isNaN(val){
        // based on the fact that NaN !== NaN
        // need to check if it's a number to avoid conflicts with host objects
        // also need to coerce ToNumber to avoid edge case `new Number(NaN)`
        return !isNumber(val) || $isNaN(Number(val));
    }

    module.exports = isNaN;



},{"../number/isNaN":51,"./isNumber":40}],39:[function(require,module,exports){

    /**
     */
    function isNull(val){
        return val === null;
    }
    module.exports = isNull;



},{}],40:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isNumber(val) {
        return isKind(val, 'Number');
    }
    module.exports = isNumber;


},{"./isKind":37}],41:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":37}],42:[function(require,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],43:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isRegExp(val) {
        return isKind(val, 'RegExp');
    }
    module.exports = isRegExp;


},{"./isKind":37}],44:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isString(val) {
        return isKind(val, 'String');
    }
    module.exports = isString;


},{"./isKind":37}],45:[function(require,module,exports){

    var UNDEF;

    /**
     */
    function isUndef(val){
        return val === UNDEF;
    }
    module.exports = isUndef;


},{}],46:[function(require,module,exports){
var is = require('./is');

    /**
     * Check if both values are not identical/egal
     */
    function isnt(x, y){
        return !is(x, y);
    }

    module.exports = isnt;



},{"./is":28}],47:[function(require,module,exports){


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


},{}],48:[function(require,module,exports){
var kindOf = require('./kindOf');

    var _win = this;

    /**
     * Convert array-like object into array
     */
    function toArray(val){
        var ret = [],
            kind = kindOf(val),
            n;

        if (val != null) {
            if ( val.length == null || kind === 'String' || kind === 'Function' || kind === 'RegExp' || val === _win ) {
                //string, regexp, function have .length but user probably just want
                //to wrap value into an array..
                ret[ret.length] = val;
            } else {
                //window returns true on isObject in IE7 and may have length
                //property. `typeof NodeList` returns `function` on Safari so
                //we can't use it (#58)
                n = val.length;
                while (n--) {
                    ret[n] = val[n];
                }
            }
        }
        return ret;
    }
    module.exports = toArray;


},{"./kindOf":47}],49:[function(require,module,exports){
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



},{"./isArray":30}],50:[function(require,module,exports){


    /**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    module.exports = toString;



},{}],51:[function(require,module,exports){


    /**
     * ES6 Number.isNaN
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
     */
    function isNaN(val){
        // jshint eqeqeq:false
        return typeof val === 'number' && val != val;
    }

    module.exports = isNaN;



},{}],52:[function(require,module,exports){


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



},{}],53:[function(require,module,exports){


//automatically generated, do not edit!
//run `node build` instead
module.exports = {
    'bindAll' : require('./object/bindAll'),
    'contains' : require('./object/contains'),
    'deepEquals' : require('./object/deepEquals'),
    'deepFillIn' : require('./object/deepFillIn'),
    'deepMatches' : require('./object/deepMatches'),
    'deepMixIn' : require('./object/deepMixIn'),
    'equals' : require('./object/equals'),
    'every' : require('./object/every'),
    'fillIn' : require('./object/fillIn'),
    'filter' : require('./object/filter'),
    'find' : require('./object/find'),
    'forIn' : require('./object/forIn'),
    'forOwn' : require('./object/forOwn'),
    'functions' : require('./object/functions'),
    'get' : require('./object/get'),
    'has' : require('./object/has'),
    'hasOwn' : require('./object/hasOwn'),
    'keys' : require('./object/keys'),
    'map' : require('./object/map'),
    'matches' : require('./object/matches'),
    'max' : require('./object/max'),
    'merge' : require('./object/merge'),
    'min' : require('./object/min'),
    'mixIn' : require('./object/mixIn'),
    'namespace' : require('./object/namespace'),
    'pick' : require('./object/pick'),
    'pluck' : require('./object/pluck'),
    'reduce' : require('./object/reduce'),
    'reject' : require('./object/reject'),
    'set' : require('./object/set'),
    'size' : require('./object/size'),
    'some' : require('./object/some'),
    'unset' : require('./object/unset'),
    'values' : require('./object/values')
};



},{"./object/bindAll":54,"./object/contains":55,"./object/deepEquals":56,"./object/deepFillIn":57,"./object/deepMatches":58,"./object/deepMixIn":59,"./object/equals":60,"./object/every":61,"./object/fillIn":62,"./object/filter":63,"./object/find":64,"./object/forIn":65,"./object/forOwn":66,"./object/functions":67,"./object/get":68,"./object/has":69,"./object/hasOwn":70,"./object/keys":71,"./object/map":72,"./object/matches":73,"./object/max":74,"./object/merge":75,"./object/min":76,"./object/mixIn":77,"./object/namespace":78,"./object/pick":79,"./object/pluck":80,"./object/reduce":81,"./object/reject":82,"./object/set":83,"./object/size":84,"./object/some":85,"./object/unset":86,"./object/values":87}],54:[function(require,module,exports){
var functions = require('./functions');
var bind = require('../function/bind');
var forEach = require('../array/forEach');
var slice = require('../array/slice');

    /**
     * Binds methods of the object to be run in it's own context.
     */
    function bindAll(obj, rest_methodNames){
        var keys = arguments.length > 1?
                    slice(arguments, 1) : functions(obj);
        forEach(keys, function(key){
            obj[key] = bind(obj[key], obj);
        });
    }

    module.exports = bindAll;



},{"../array/forEach":13,"../array/slice":16,"../function/bind":17,"./functions":67}],55:[function(require,module,exports){
var some = require('./some');

    /**
     * Check if object contains value
     */
    function contains(obj, needle) {
        return some(obj, function(val) {
            return (val === needle);
        });
    }
    module.exports = contains;



},{"./some":85}],56:[function(require,module,exports){
var isObject = require('../lang/isObject');
var equals = require('./equals');

    function defaultCompare(a, b) {
        return a === b;
    }

    /**
     * Recursively checks for same properties and values.
     */
    function deepEquals(a, b, callback){
        callback = callback || defaultCompare;

        if (!isObject(a) || !isObject(b)) {
            return callback(a, b);
        }

        function compare(a, b){
            return deepEquals(a, b, callback);
        }

        return equals(a, b, compare);
    }

    module.exports = deepEquals;



},{"../lang/isObject":41,"./equals":60}],57:[function(require,module,exports){
var forOwn = require('./forOwn');
var isPlainObject = require('../lang/isPlainObject');

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



},{"../lang/isPlainObject":42,"./forOwn":66}],58:[function(require,module,exports){
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



},{"../lang/isArray":30,"./forOwn":66}],59:[function(require,module,exports){
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



},{"../lang/isPlainObject":42,"./forOwn":66}],60:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var every = require('./every');
var isObject = require('../lang/isObject');

    function defaultCompare(a, b) {
        return a === b;
    }

    // Makes a function to compare the object values from the specified compare
    // operation callback.
    function makeCompare(callback) {
        return function(value, key) {
            return hasOwn(this, key) && callback(value, this[key]);
        };
    }

    function checkProperties(value, key) {
        return hasOwn(this, key);
    }

    /**
     * Checks if two objects have the same keys and values.
     */
    function equals(a, b, callback) {
        callback = callback || defaultCompare;

        if (!isObject(a) || !isObject(b)) {
            return callback(a, b);
        }

        return (every(a, makeCompare(callback), b) &&
                every(b, checkProperties, a));
    }

    module.exports = equals;


},{"../lang/isObject":41,"./every":61,"./hasOwn":70}],61:[function(require,module,exports){
var forOwn = require('./forOwn');
var makeIterator = require('../function/makeIterator_');

    /**
     * Object every
     */
    function every(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = true;
        forOwn(obj, function(val, key) {
            // we consider any falsy values as "false" on purpose so shorthand
            // syntax can be used to check property existence
            if (!callback(val, key, obj)) {
                result = false;
                return false; // break
            }
        });
        return result;
    }

    module.exports = every;



},{"../function/makeIterator_":19,"./forOwn":66}],62:[function(require,module,exports){
var forEach = require('../array/forEach');
var slice = require('../array/slice');
var forOwn = require('./forOwn');

    /**
     * Copy missing properties in the obj from the defaults.
     */
    function fillIn(obj, var_defaults){
        forEach(slice(arguments, 1), function(base){
            forOwn(base, function(val, key){
                if (obj[key] == null) {
                    obj[key] = val;
                }
            });
        });
        return obj;
    }

    module.exports = fillIn;



},{"../array/forEach":13,"../array/slice":16,"./forOwn":66}],63:[function(require,module,exports){
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


},{"../function/makeIterator_":19,"./forOwn":66}],64:[function(require,module,exports){
var some = require('./some');
var makeIterator = require('../function/makeIterator_');

    /**
     * Returns first item that matches criteria
     */
    function find(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result;
        some(obj, function(value, key, obj) {
            if (callback(value, key, obj)) {
                result = value;
                return true; //break
            }
        });
        return result;
    }

    module.exports = find;



},{"../function/makeIterator_":19,"./some":85}],65:[function(require,module,exports){


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



},{}],66:[function(require,module,exports){
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



},{"./forIn":65,"./hasOwn":70}],67:[function(require,module,exports){
var forIn = require('./forIn');

    /**
     * return a list of all enumerable properties that have function values
     */
    function functions(obj){
        var keys = [];
        forIn(obj, function(val, key){
            if (typeof val === 'function'){
                keys.push(key);
            }
        });
        return keys.sort();
    }

    module.exports = functions;



},{"./forIn":65}],68:[function(require,module,exports){


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



},{}],69:[function(require,module,exports){
var get = require('./get');

    var UNDEF;

    /**
     * Check if object has nested property.
     */
    function has(obj, prop){
        return get(obj, prop) !== UNDEF;
    }

    module.exports = has;




},{"./get":68}],70:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],71:[function(require,module,exports){
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



},{"./forOwn":66}],72:[function(require,module,exports){
var forOwn = require('./forOwn');
var makeIterator = require('../function/makeIterator_');

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


},{"../function/makeIterator_":19,"./forOwn":66}],73:[function(require,module,exports){
var forOwn = require('./forOwn');

    /**
     * checks if a object contains all given properties/values
     */
    function matches(target, props){
        // can't use "object/every" because of circular dependency
        var result = true;
        forOwn(props, function(val, key){
            if (target[key] !== val) {
                // break loop at first difference
                return (result = false);
            }
        });
        return result;
    }

    module.exports = matches;



},{"./forOwn":66}],74:[function(require,module,exports){
var arrMax = require('../array/max');
var values = require('./values');

    /**
     * Returns maximum value inside object.
     */
    function max(obj, compareFn) {
        return arrMax(values(obj), compareFn);
    }

    module.exports = max;


},{"../array/max":14,"./values":87}],75:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var deepClone = require('../lang/deepClone');
var isObject = require('../lang/isObject');

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



},{"../lang/deepClone":25,"../lang/isObject":41,"./hasOwn":70}],76:[function(require,module,exports){
var arrMin = require('../array/min');
var values = require('./values');

    /**
     * Returns minimum value inside object.
     */
    function min(obj, iterator) {
        return arrMin(values(obj), iterator);
    }

    module.exports = min;


},{"../array/min":15,"./values":87}],77:[function(require,module,exports){
var forOwn = require('./forOwn');

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


},{"./forOwn":66}],78:[function(require,module,exports){
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



},{"../array/forEach":13}],79:[function(require,module,exports){
var slice = require('../array/slice');

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



},{"../array/slice":16}],80:[function(require,module,exports){
var map = require('./map');
var prop = require('../function/prop');

    /**
     * Extract a list of property values.
     */
    function pluck(obj, propName){
        return map(obj, prop(propName));
    }

    module.exports = pluck;



},{"../function/prop":20,"./map":72}],81:[function(require,module,exports){
var forOwn = require('./forOwn');
var size = require('./size');

    /**
     * Object reduce
     */
    function reduce(obj, callback, memo, thisObj) {
        var initial = arguments.length > 2;

        if (!size(obj) && !initial) {
            throw new Error('reduce of empty object with no initial value');
        }

        forOwn(obj, function(value, key, list) {
            if (!initial) {
                memo = value;
                initial = true;
            }
            else {
                memo = callback.call(thisObj, memo, value, key, list);
            }
        });

        return memo;
    }

    module.exports = reduce;



},{"./forOwn":66,"./size":84}],82:[function(require,module,exports){
var filter = require('./filter');
var makeIterator = require('../function/makeIterator_');

    /**
     * Object reject
     */
    function reject(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        return filter(obj, function(value, index, obj) {
            return !callback(value, index, obj);
        }, thisObj);
    }

    module.exports = reject;



},{"../function/makeIterator_":19,"./filter":63}],83:[function(require,module,exports){
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



},{"./namespace":78}],84:[function(require,module,exports){
var forOwn = require('./forOwn');

    /**
     * Get object size
     */
    function size(obj) {
        var count = 0;
        forOwn(obj, function(){
            count++;
        });
        return count;
    }

    module.exports = size;



},{"./forOwn":66}],85:[function(require,module,exports){
var forOwn = require('./forOwn');
var makeIterator = require('../function/makeIterator_');

    /**
     * Object some
     */
    function some(obj, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = false;
        forOwn(obj, function(val, key) {
            if (callback(val, key, obj)) {
                result = true;
                return false; // break
            }
        });
        return result;
    }

    module.exports = some;



},{"../function/makeIterator_":19,"./forOwn":66}],86:[function(require,module,exports){
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



},{"./has":69}],87:[function(require,module,exports){
var forOwn = require('./forOwn');

    /**
     * Get object values
     */
    function values(obj) {
        var vals = [];
        forOwn(obj, function(val, key){
            vals.push(val);
        });
        return vals;
    }

    module.exports = values;



},{"./forOwn":66}]},{},[2])
(2)
});
;
