'use strict';

var utils = require('../support/utils');

var defaultRules = require('../defaultRules');

var rules = require('../rules');

module.exports = {
	defineRule: function (name, ruleFunc, async) {
		if (!utils.isString(name)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): name: Must be a string!');
		} else if (!utils.isFunction(ruleFunc)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): ruleFunc: Must be a function!');
		} else if (rules[name]) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): name: Name already in use!');
		} else if (async && !utils.isBoolean(async)) {
			throw new Error('robocop.defineRule(name, ruleFunc[, async]): async: Must be a boolean!');
		}
		rules[name] = ruleFunc;
		if (async) {
			rules[name].async = true;
		}
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
