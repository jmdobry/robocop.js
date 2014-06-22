'use strict';

var utils = require('../support/utils'),
  Schema = require('../schema');

var schemas = {};

module.exports = {
  defineSchema: function (name, schema) {
    if (schemas[name]) {
      throw new Error('robocop.defineSchema(name, schema): name: Name already in use!');
    }
    if (schema instanceof Schema) {
      schemas[name] = schema;
    } else {
      if (!utils.isObject(schema)) {
        throw new Error('robocop.defineSchema(name, schema): schema: Must be an object or an instance of Schema!');
      }
      schemas[name] = new Schema(name, schema);
    }
    return schemas[name];
  },

  getSchema: function (name) {
    if (!utils.isString(name)) {
      throw new Error('robocop.getSchema(name): name: Must be a string!');
    }
    return schemas[name];
  },

  availableSchemas: function () {
    return utils.keys(schemas);
  },

  removeSchema: function (name) {
    if (!utils.isString(name)) {
      throw new Error('robocop.removeSchema(name): name: Must be a string!');
    }
    if (schemas[name]) {
      delete schemas[name];
    }
  }
};
