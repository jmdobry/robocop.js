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
