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