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

	contains: require('mout/array/contains'),
	intersection: require('mout/array/intersection'),

	toInt: require('mout/number/toInt')
};
