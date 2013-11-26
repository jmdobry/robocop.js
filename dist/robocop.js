/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file robocop.js
 * @version 0.4.1 - Homepage <http://jmdobry.github.io/robocop.js/>
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>
 * @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>
 *
 * @overview Object inspector and schema validator for Node.js and the browser.
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
},{"mout/lang":19,"mout/number/toInt":50}],2:[function(require,module,exports){
'use strict';

module.exports = require('./robocop');
},{"./robocop":4}],3:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	keys = require('mout/object/keys');

var defaultDataTypes = require('../dataType');

var dataTypes = {};

module.exports = {
	defineDataType: function defineDataType(name, typeDefinition) {
		if (!isString(name)) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Must be a string!');
		}
		if (dataTypes[name]) {
			throw new Error('robocop.defineDataType(name, typeDefinition): name: Name already is use!');
		}
		dataTypes[name] = typeDefinition.typeFunc;
	},

	hasDataType: function hasDataType(name) {
		if (!isString(name)) {
			throw new Error('robocop.hasDataType(name): name: Must be a string!');
		}
		return !!dataTypes[name];
	},

	getDataType: function getDataType(name) {
		if (!isString(name)) {
			throw new Error('robocop.getDataType(name): name: Must be a string!');
		}
		return dataTypes[name];
	},

	availableDataTypes: function availableDataTypes() {
		return keys(dataTypes).concat(keys(defaultDataTypes));
	},

	testDataType: function testDataType(name, value) {
		if (!isString(name)) {
			throw new Error('robocop.testDataType(name, value): name: Must be a string!');
		} else if (!dataTypes[name] && !defaultDataTypes[name]) {
			throw new Error('robocop.testDataType(name, value): name: No dataType with that name exists!');
		}
		return dataTypes[name] ? dataTypes[name](value) : defaultDataTypes[name](value);
	}
};
},{"../dataType":1,"mout/lang/isString":42,"mout/object/keys":69}],4:[function(require,module,exports){
'use strict';

var deepMixIn = require('mout/object/deepMixIn');

var robocop = module.exports = {};

deepMixIn(robocop, require('./schema'));
deepMixIn(robocop, require('./rule'));
deepMixIn(robocop, require('./dataType'));
},{"./dataType":3,"./rule":5,"./schema":6,"mout/object/deepMixIn":57}],5:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	keys = require('mout/object/keys');

var defaultRules = require('../rule');

var rules = {};

module.exports = {
	defineRule: function defineRule(name, ruleFunc) {
		if (rules[name]) {
			throw new Error('robocop.defineRule(name, ruleFunc): name: Name already in use!');
		}
		rules[name] = ruleFunc;
	},

	hasRule: function hasRule(name) {
		if (!isString(name)) {
			throw new Error('robocop.hasRule(name): name: Must be a string!');
		}
		return !!rules[name];
	},

	getRule: function getRule(name) {
		if (!isString(name)) {
			throw new Error('robocop.getRule(name): name: Must be a string!');
		}
		return rules[name];
	},

	availableRules: function availableRules() {
		return keys(rules).concat(keys(defaultRules));
	},

	testRule: function testRule(name, value, options) {
		if (!isString(name)) {
			throw new Error('robocop.testRule(name, value, options): name: Must be a string!');
		} else if (!rules[name] && !defaultRules[name]) {
			throw new Error('robocop.testRule(name, value, options): name: No rule with that name exists!');
		}
		return rules[name] ? rules[name](value, options) : defaultRules[name](value, options);
	}
};
},{"../rule":7,"mout/lang/isString":42,"mout/object/keys":69}],6:[function(require,module,exports){
'use strict';

var isString = require('mout/lang/isString'),
	isObject = require('mout/lang/isObject'),
	keys = require('mout/object/keys'),
	Schema = require('../schema');

var schemas = {};

module.exports = {
	defineSchema: function definedSchema(name, schema) {
		if (schemas[name]) {
			throw new Error('robocop.defineSchema(name, schema): name: Name already in use!');
		}
		schemas[name] = new Schema(name, schema);

		return schemas[name];
	},

	hasSchema: function hasSchema(name) {
		if (!isString(name)) {
			throw new Error('robocop.hasSchema(name): name: Must be a string!');
		}
		return !!schemas[name];
	},

	getSchema: function getSchema(name) {
		if (!isString(name)) {
			throw new Error('robocop.getSchema(name): name: Must be a string!');
		}
		return schemas[name];
	},

	availableSchemas: function availableSchemas() {
		return keys(schemas);
	},

	testSchema: function testSchema(name, obj) {
		if (!isString(name)) {
			throw new Error('robocop.validate(name, obj): name: Must be a string!');
		} else if (!isObject(obj)) {
			throw new Error('robocop.validate(name, obj): obj: Must be an object!');
		} else if (!schemas[name]) {
			throw new Error('robocop.validate(name, obj): name: No schema with that name exists!');
		}
		return schemas[name].validate(obj);
	}
};
},{"../schema":8,"mout/lang/isObject":39,"mout/lang/isString":42,"mout/object/keys":69}],7:[function(require,module,exports){
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
},{"../dataType":1,"mout/lang":19}],8:[function(require,module,exports){
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

function _validate(targetKey, attrs, cb) {
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
		cb(errors);
	} else {
		cb();
	}
}

Schema.prototype.validate = function validate(attrs, cb) {
	_validate.apply(this, ['', attrs, function (errors) {
		if (errors && object.keys(errors).length > 0) {
			cb(errors);
		} else {
			cb();
		}
	}]);
};
},{"../rule":7,"mout/lang":19,"mout/object":51}],9:[function(require,module,exports){
var findIndex = require('./findIndex');

    /**
     * Returns first item that matches criteria
     */
    function find(arr, iterator, thisObj){
        var idx = findIndex(arr, iterator, thisObj);
        return idx >= 0? arr[idx] : void(0);
    }

    module.exports = find;



},{"./findIndex":10}],10:[function(require,module,exports){
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


},{"../function/makeIterator_":17}],11:[function(require,module,exports){


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



},{}],12:[function(require,module,exports){
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



},{"../function/makeIterator_":17}],13:[function(require,module,exports){
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



},{"../function/makeIterator_":17}],14:[function(require,module,exports){


    var arrSlice = Array.prototype.slice;

    /**
     * Create slice of source array or array-like object
     */
    function slice(arr, start, end){
        return arrSlice.call(arr, start, end);
    }

    module.exports = slice;



},{}],15:[function(require,module,exports){
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



},{"../array/slice":14}],16:[function(require,module,exports){


    /**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    module.exports = identity;



},{}],17:[function(require,module,exports){
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



},{"../object/deepMatches":56,"./identity":16,"./prop":18}],18:[function(require,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],19:[function(require,module,exports){


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



},{"./lang/clone":20,"./lang/createObject":21,"./lang/ctorApply":22,"./lang/deepClone":23,"./lang/defaults":24,"./lang/inheritPrototype":25,"./lang/is":26,"./lang/isArguments":27,"./lang/isArray":28,"./lang/isBoolean":29,"./lang/isDate":30,"./lang/isEmpty":31,"./lang/isFinite":32,"./lang/isFunction":33,"./lang/isInteger":34,"./lang/isKind":35,"./lang/isNaN":36,"./lang/isNull":37,"./lang/isNumber":38,"./lang/isObject":39,"./lang/isPlainObject":40,"./lang/isRegExp":41,"./lang/isString":42,"./lang/isUndefined":43,"./lang/isnt":44,"./lang/kindOf":45,"./lang/toArray":46,"./lang/toNumber":47,"./lang/toString":48}],20:[function(require,module,exports){
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



},{"../object/mixIn":75,"./isPlainObject":40,"./kindOf":45}],21:[function(require,module,exports){
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



},{"../object/mixIn":75}],22:[function(require,module,exports){


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



},{}],23:[function(require,module,exports){
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




},{"../object/forOwn":64,"./clone":20,"./isPlainObject":40,"./kindOf":45}],24:[function(require,module,exports){
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



},{"../array/find":9,"./toArray":46}],25:[function(require,module,exports){
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


},{"./createObject":21}],26:[function(require,module,exports){


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



},{}],27:[function(require,module,exports){
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


},{"./isKind":35}],28:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":35}],29:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isBoolean(val) {
        return isKind(val, 'Boolean');
    }
    module.exports = isBoolean;


},{"./isKind":35}],30:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isDate(val) {
        return isKind(val, 'Date');
    }
    module.exports = isDate;


},{"./isKind":35}],31:[function(require,module,exports){
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



},{"../object/forOwn":64,"./isArray":28}],32:[function(require,module,exports){
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



},{"./isNumber":38}],33:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isFunction(val) {
        return isKind(val, 'Function');
    }
    module.exports = isFunction;


},{"./isKind":35}],34:[function(require,module,exports){
var isNumber = require('./isNumber');

    /**
     * Check if value is an integer
     */
    function isInteger(val){
        return isNumber(val) && (val % 1 === 0);
    }

    module.exports = isInteger;



},{"./isNumber":38}],35:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":45}],36:[function(require,module,exports){
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



},{"../number/isNaN":49,"./isNumber":38}],37:[function(require,module,exports){

    /**
     */
    function isNull(val){
        return val === null;
    }
    module.exports = isNull;



},{}],38:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isNumber(val) {
        return isKind(val, 'Number');
    }
    module.exports = isNumber;


},{"./isKind":35}],39:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    module.exports = isObject;


},{"./isKind":35}],40:[function(require,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],41:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isRegExp(val) {
        return isKind(val, 'RegExp');
    }
    module.exports = isRegExp;


},{"./isKind":35}],42:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    function isString(val) {
        return isKind(val, 'String');
    }
    module.exports = isString;


},{"./isKind":35}],43:[function(require,module,exports){

    var UNDEF;

    /**
     */
    function isUndef(val){
        return val === UNDEF;
    }
    module.exports = isUndef;


},{}],44:[function(require,module,exports){
var is = require('./is');

    /**
     * Check if both values are not identical/egal
     */
    function isnt(x, y){
        return !is(x, y);
    }

    module.exports = isnt;



},{"./is":26}],45:[function(require,module,exports){


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


},{}],46:[function(require,module,exports){
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


},{"./kindOf":45}],47:[function(require,module,exports){
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



},{"./isArray":28}],48:[function(require,module,exports){


    /**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    module.exports = toString;



},{}],49:[function(require,module,exports){


    /**
     * ES6 Number.isNaN
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
     */
    function isNaN(val){
        // jshint eqeqeq:false
        return typeof val === 'number' && val != val;
    }

    module.exports = isNaN;



},{}],50:[function(require,module,exports){


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



},{}],51:[function(require,module,exports){


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



},{"./object/bindAll":52,"./object/contains":53,"./object/deepEquals":54,"./object/deepFillIn":55,"./object/deepMatches":56,"./object/deepMixIn":57,"./object/equals":58,"./object/every":59,"./object/fillIn":60,"./object/filter":61,"./object/find":62,"./object/forIn":63,"./object/forOwn":64,"./object/functions":65,"./object/get":66,"./object/has":67,"./object/hasOwn":68,"./object/keys":69,"./object/map":70,"./object/matches":71,"./object/max":72,"./object/merge":73,"./object/min":74,"./object/mixIn":75,"./object/namespace":76,"./object/pick":77,"./object/pluck":78,"./object/reduce":79,"./object/reject":80,"./object/set":81,"./object/size":82,"./object/some":83,"./object/unset":84,"./object/values":85}],52:[function(require,module,exports){
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



},{"../array/forEach":11,"../array/slice":14,"../function/bind":15,"./functions":65}],53:[function(require,module,exports){
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



},{"./some":83}],54:[function(require,module,exports){
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



},{"../lang/isObject":39,"./equals":58}],55:[function(require,module,exports){
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



},{"../lang/isPlainObject":40,"./forOwn":64}],56:[function(require,module,exports){
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



},{"../lang/isArray":28,"./forOwn":64}],57:[function(require,module,exports){
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



},{"../lang/isPlainObject":40,"./forOwn":64}],58:[function(require,module,exports){
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


},{"../lang/isObject":39,"./every":59,"./hasOwn":68}],59:[function(require,module,exports){
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



},{"../function/makeIterator_":17,"./forOwn":64}],60:[function(require,module,exports){
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



},{"../array/forEach":11,"../array/slice":14,"./forOwn":64}],61:[function(require,module,exports){
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


},{"../function/makeIterator_":17,"./forOwn":64}],62:[function(require,module,exports){
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



},{"../function/makeIterator_":17,"./some":83}],63:[function(require,module,exports){


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



},{}],64:[function(require,module,exports){
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



},{"./forIn":63,"./hasOwn":68}],65:[function(require,module,exports){
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



},{"./forIn":63}],66:[function(require,module,exports){


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



},{}],67:[function(require,module,exports){
var get = require('./get');

    var UNDEF;

    /**
     * Check if object has nested property.
     */
    function has(obj, prop){
        return get(obj, prop) !== UNDEF;
    }

    module.exports = has;




},{"./get":66}],68:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],69:[function(require,module,exports){
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



},{"./forOwn":64}],70:[function(require,module,exports){
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


},{"../function/makeIterator_":17,"./forOwn":64}],71:[function(require,module,exports){
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



},{"./forOwn":64}],72:[function(require,module,exports){
var arrMax = require('../array/max');
var values = require('./values');

    /**
     * Returns maximum value inside object.
     */
    function max(obj, compareFn) {
        return arrMax(values(obj), compareFn);
    }

    module.exports = max;


},{"../array/max":12,"./values":85}],73:[function(require,module,exports){
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



},{"../lang/deepClone":23,"../lang/isObject":39,"./hasOwn":68}],74:[function(require,module,exports){
var arrMin = require('../array/min');
var values = require('./values');

    /**
     * Returns minimum value inside object.
     */
    function min(obj, iterator) {
        return arrMin(values(obj), iterator);
    }

    module.exports = min;


},{"../array/min":13,"./values":85}],75:[function(require,module,exports){
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


},{"./forOwn":64}],76:[function(require,module,exports){
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



},{"../array/forEach":11}],77:[function(require,module,exports){
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



},{"../array/slice":14}],78:[function(require,module,exports){
var map = require('./map');
var prop = require('../function/prop');

    /**
     * Extract a list of property values.
     */
    function pluck(obj, propName){
        return map(obj, prop(propName));
    }

    module.exports = pluck;



},{"../function/prop":18,"./map":70}],79:[function(require,module,exports){
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



},{"./forOwn":64,"./size":82}],80:[function(require,module,exports){
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



},{"../function/makeIterator_":17,"./filter":61}],81:[function(require,module,exports){
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



},{"./namespace":76}],82:[function(require,module,exports){
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



},{"./forOwn":64}],83:[function(require,module,exports){
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



},{"../function/makeIterator_":17,"./forOwn":64}],84:[function(require,module,exports){
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



},{"./has":67}],85:[function(require,module,exports){
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



},{"./forOwn":64}]},{},[2])
(2)
});
;