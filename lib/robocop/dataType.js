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