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

	testSchema: function testSchema(attrs, options) {
		if (!isObject(attrs)) {
			throw new Error('robocop.testSchema(attrs, options, cb): attrs: Must be an object!');
		} else if (!isObject(options)) {
			throw new Error('robocop.testSchema(attrs, options, cb): options: Must be an object!');
		} else if (!schemas[options.name]) {
			throw new Error('robocop.testSchema(attrs, options, cb): options.name: No schema with that name exists!');
		}
		return schemas[options.name].validate(attrs, options);
	}
};
