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
