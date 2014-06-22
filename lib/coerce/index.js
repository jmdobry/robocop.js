'use strict';

var utils = require('../support/utils');

module.exports = {
  string: function (x) {
    if (utils.isNumber(x)) {
      return utils.toString(x);
    }
    return x;
  },
  number: utils.toNumber,
  integer: function (x) {
    var num = utils.toNumber(x);
    if (utils.isNumber(num) && !isNaN(num)) {
      return utils.toInt(num);
    }
    return utils.toNumber(x);
  },
  float: function (x) {
    if (x === null || x === '' || x === false || utils.isUndefined(x)) {
      return 0.0;
    } else if (x === true) {
      return 1.0;
    }
    return parseFloat(x);
  },
  array: function (x) {
    if (utils.isArray(x) && !utils.isEmpty(x)) {
      return x;
    } else if (x === null || utils.isUndefined(x) || utils.isEmpty(x)) {
      return null;
    }
    return [x];
  },
  object: function (x) {
    if (utils.isObject(x) && !utils.isEmpty(x)) {
      return x;
    } else if (x === null || utils.isUndefined(x) || utils.isEmpty(x)) {
      return null;
    }
    return x;
  },
  boolean: function (x) {
    if (utils.isEmpty(x)) {
      return false;
    }
    return !!x;
  }
  // TODO: Coercions for dates
};
