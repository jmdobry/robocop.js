'use strict';

var utils = require('../support/utils');

var defaultDataTypes = require('../dataType');

var dataTypes = {};

module.exports = {
  defineDataType: function (name, typeDefinition) {
    if (!utils.isString(name)) {
      throw new Error('robocop.defineDataType(name, typeDefinition): name: Must be a string!');
    } else if (!utils.isFunction(typeDefinition)) {
      throw new Error('robocop.defineDataType(name, typeDefinition): typeDefinition: Must be a function!');
    } else if (dataTypes[name]) {
      throw new Error('robocop.defineDataType(name, typeDefinition): name: Name already in use!');
    }
    dataTypes[name] = typeDefinition;
  },

  getDataType: function (name) {
    if (!utils.isString(name)) {
      throw new Error('robocop.getDataType(name): name: Must be a string!');
    }
    return dataTypes[name] || defaultDataTypes[name];
  },

  availableDataTypes: function () {
    return utils.keys(dataTypes).concat(utils.keys(defaultDataTypes));
  },

  removeDataType: function (name) {
    if (!utils.isString(name)) {
      throw new Error('robocop.removeDataType(name): name: Must be a string!');
    }
    if (dataTypes[name]) {
      delete dataTypes[name];
    }
  }
};
