'use strict';

var utils = require('../support/utils');

module.exports = {
  string: function (x) {
    if (utils.isString(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'string'
      };
    }
  },
  number: function (x) {
    if (utils.isNumber(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'number'
      };
    }
  },
  integer: function (x) {
    if (!utils.isNumber(x)) {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'integer'
      };
    } else if (Math.abs(x) - Math.abs(utils.toInt(x)) !== 0) {
      return {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      };
    } else {
      return null;
    }
  },
  float: function (x) {
    if (utils.isNumber(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'float'
      };
    }
  },
  array: function (x) {
    if (utils.isArray(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'array'
      };
    }
  },
  object: function (x) {
    if (utils.isObject(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'object'
      };
    }
  },
  boolean: function (x) {
    if (utils.isBoolean(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'boolean'
      };
    }
  },
  date: function (x) {
    if (utils.isDate(x)) {
      return null;
    } else {
      return {
        rule: 'type',
        actual: typeof x,
        expected: 'date'
      };
    }
  }
};
