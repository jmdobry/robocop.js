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
