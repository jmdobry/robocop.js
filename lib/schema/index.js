/*jshint latedef:false*/
'use strict';

var utils = require('../support/utils'),
  defaultRules = require('../defaultRules'),
  rules;

var _parallel = function (tasks, cb) {
  var results = {},
    completed = 0,
    length = 0;

  utils.forOwn(tasks, function () {
    length += 1;
  });


  utils.forOwn(tasks, function (task, key) {
    task(function (err) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (args.length <= 1) {
        args = args[0];
      }
      results[key] = args;
      done(err);
    });
  });

  function done(err) {
    completed += 1;
    if (err || completed >= length) {
      cb(err, results);
    }
  }
};

function _sanitize(attrs, rules) {
  rules = rules || [];
  var keys = utils.keys(attrs);
  var noRules = utils.intersection(keys, rules).length === 0;

  utils.forOwn(attrs, function (value, key) {
    if (noRules && utils.isString(value)) {
      attrs[key] = {
        type: value
      };
    } else if (utils.isObject(value)) {
      if (utils.contains(rules, key)) {
        throw new Error('Schema(name, schema): schema: Rule configuration for rule "' + key + '" cannot be an object!');
      } else {
        _sanitize(value, rules);
      }
    }
  });
}

function validateSchema(schema) {
  if (!utils.isObject(schema)) {
    throw new Error('Schema(name, schema): schema: Must be an object!');
  }
  _sanitize(schema, require('../robocop/rule').availableRules());
}

var Schema = module.exports = function Schema(name, schema) {

  if (!utils.isString(name)) {
    throw new Error('Schema(name, schema): name: Must be a string!');
  }
  this.name = name;

  validateSchema(schema);
  this.schema = schema;
  rules = require('../rules');
};

function _executeRulesSync(targetKey, options, errors, value, key) {
  var _this = this,
    nestedKey = targetKey + (targetKey.length ? '.' : '') + key;

  if (utils.isObject(value)) {
    var err = _validateSync.apply(_this, [nestedKey, value, options]);
    if (err) {
      errors[key] = err;
    }
  } else {
    var schemaRules = utils.get(_this.schema, nestedKey);
    if (!utils.isObject(schemaRules)) {
      return;
    } else if (schemaRules.nullable === true) {
      var nullable = rules.nullable || defaultRules.nullable,
        nErr = nullable(value, true);

      if (nErr === null) {
        return;
      }
    }
    utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
      var rule = rules[ruleKey] || defaultRules[ruleKey];
      if (!rule.async) {
        var err = rule(value, ruleValue);
        if (err) {
          if (!errors[key]) {
            errors[key] = {
              errors: []
            };
          }
          errors[key].errors.push(err);
        }
      }
    });
  }
}

/**
 * @see Schema#validateSync
 */
function _validateSync(targetKey, attrs, options) {
  var errors = {},
    _this = this;

  try {
    // Validate present attributes
    utils.forOwn(attrs, function (value, key) {
      _executeRulesSync.call(_this, targetKey, options, errors, value, key);
    });
    // Validate missing attributes
    if (!options.ignoreMissing) {
      var schema = targetKey ? utils.get(_this.schema, targetKey) || {} : _this.schema,
        missing = utils.difference(utils.keys(schema), utils.keys(attrs));
      missing = utils.pick(this.schema, missing);
      missing = utils.map(missing, function () {
        return undefined;
      });
      utils.forOwn(missing, function (value, key) {
        _executeRulesSync.call(_this, targetKey, options, errors, value, key);
      });
    }
    if (!utils.isEmpty(errors)) {
      return errors;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

function _executeRules(options, value, key, prefix, errors, deepQueue, ruleQueue) {
  var _this = this,
    nestedKey = prefix + key;

  if (utils.isObject(value)) {
    // Recurse down into nested attributes
    deepQueue[key] = (function (nK, val) {
      return function (next) {
        _validate.apply(_this, [nK, val, options, next]);
      };
    })(nestedKey, value);
  } else {
    var schemaRules = utils.get(_this.schema, nestedKey);
    if (!utils.isObject(schemaRules)) {
      return;
    } else if (schemaRules.nullable === true) {
      var nullable = rules.nullable || defaultRules.nullable,
        nErr = nullable(value, true);

      if (nErr === null) {
        return;
      }
    }
    utils.forOwn(schemaRules, function (ruleValue, ruleKey) {
      var rule = rules[ruleKey] || defaultRules[ruleKey];
      // Asynchronous rules get added to the queue
      if (rule.async) {
        ruleQueue[ruleKey] = (function (r, key, val, rVal) {
          return function (next) {
            r(val, rVal, function (err) {
              next(null, { err: err, key: key });
            });
          };
        })(rule, key, value, ruleValue);
      } else {
        // Get results of synchronous rules immediately
        var err = rule(value, ruleValue);
        if (err) {
          if (!errors[key]) {
            errors[key] = {
              errors: []
            };
          }
          errors[key].errors.push(err);
        }
      }
    });
  }
}

/**
 * @see Schema#validate
 */
function _validate(targetKey, attrs, options, cb) {
  var errors = {},
    _this = this,
    prefix = targetKey + (targetKey.length ? '.' : ''),
    deepQueue = {},
    ruleQueue = {},
    first = options.first;

  delete options.first;

  utils.forOwn(attrs, function (value, key) {
    _executeRules.call(_this, options, value, key, prefix, errors, deepQueue, ruleQueue);
  });

  // Validate missing attributes
  if (!options.ignoreMissing) {
    var schema = targetKey ? utils.get(_this.schema, targetKey) || {} : _this.schema,
      missing = utils.difference(utils.keys(schema), utils.keys(attrs));

    missing = utils.pick(this.schema, missing);
    missing = utils.map(missing, function () {
      return undefined;
    });

    utils.forOwn(missing, function (value, key) {
      _executeRules.call(_this, options, value, key, prefix, errors, deepQueue, ruleQueue);
    });
  }

  var finalQueue = {};

  if (!utils.isEmpty(deepQueue)) {
    finalQueue.deepQueue = function (next) {
      _parallel(deepQueue, next);
    };
  }
  if (!utils.isEmpty(ruleQueue)) {
    finalQueue.ruleQueue = function (next) {
      _parallel(ruleQueue, next);
    };
  }

  if (!utils.isEmpty(finalQueue)) {
    _parallel(finalQueue, function (err, results) {

      // Merge results of recursion
      if (results.deepQueue) {
        results.deepQueue = utils.filter(results.deepQueue, function (x) {
          return x !== undefined && x !== null;
        });
        utils.deepMixIn(errors, results.deepQueue);
      }

      // Merge results of asynchronous rules
      if (results.ruleQueue) {
        if (results.ruleQueue) {
          results.ruleQueue = utils.filter(results.ruleQueue, function (x) {
            return x.err !== undefined && x.err !== null;
          });
        }
        utils.forOwn(results.ruleQueue, function (value) {
          if (!errors[value.key]) {
            errors[value.key] = {
              errors: []
            };
          }
          errors[value.key].errors.push(value.err);
        });
      }

      if (!utils.isEmpty(errors)) {
        first ? cb(errors) : cb(null, errors);
      } else {
        cb(null);
      }
    });
  } else {
    if (!utils.isEmpty(errors)) {
      first ? cb(errors) : cb(null, errors);
    } else {
      cb(null);
    }
  }
}

/**
 * @method Schema#validateSync
 * @desc Validate (synchronously) the given attributes against this Schema instance.
 * @param {object} attrs The attributes to validate.
 * @param {object} [options={}] Optional configuration.
 * @property {boolean} [options.ignoreMissing=false] If true this method will ignore validation for defined schema
 * properties that don't appear in the given hash of attributes. This is useful for validating incremental updates to an
 * object, when you don't have the full attributes of the object (client-side validation).
 * @returns {object|null} Null if validation succeeds or an error object if validation fails.
 */
Schema.prototype.validateSync = function (attrs, options) {
  options = options ? (options === true ? { ignoreMissing: true } : options) : {};
  if (!utils.isObject(attrs)) {
    throw new Error('Schema#validateSync(attrs[, options]): attrs: Must be an object!');
  } else if (!utils.isObject(options)) {
    throw new Error('Schema#validateSync(attrs[, options]): options: Must be an object!');
  }
  return _validateSync.apply(this, ['', attrs, options]);
};

/**
 * @method Schema#validate
 * @desc Validate the given attributes against this Schema instance.
 * @param {object} attrs The attributes to validate.
 * @param {object} [options={}] Optional configuration.
 * @property {boolean} [options.ignoreMissing=false] If true this method will ignore validation for defined schema
 * properties that don't appear in the given hash of attributes. This is useful for validating incremental updates to an
 * object, when you don't have the full attributes of the object (client-side validation).
 * @param {function} cb Callback function. Will receive no arguments if validation succeeds and an error object if
 * validation fails.
 */
Schema.prototype.validate = function (attrs, options, cb) {
  options = options ? (options === true ? { ignoreMissing: true } : options) : {};
  if (utils.isFunction(options)) {
    cb = options;
    options = {};
  }
  if (!utils.isFunction(cb)) {
    throw new Error('Schema#validate(attrs[, options], cb): cb: Must be a function!');
  } else if (!utils.isObject(attrs)) {
    return cb(new Error('Schema#validate(attrs[, options], cb): attrs: Must be an object!'));
  } else if (!utils.isObject(options)) {
    return cb(new Error('Schema#validate(attrs[, options], cb): options: Must be an object!'));
  }
  options.first = true;
  _validate.apply(this, ['', attrs, options, cb]);
};

/**
 * @method Schema#coerce
 * @desc Attempt to coerce the values in an object to their proper data types as specified by any "type" rules in this
 * Schema.
 * @param {object} attrs The values to coerce.
 * @returns {object} The values coerced to their proper data types.
 */
Schema.prototype.coerce = function () {
  throw new Error('Unsupported Operation!');
};

/**
 * @method Schema#addDefaultsToTarget
 * @desc Add the default values for this Schema to the target object.
 * @param {object} target The target object to which to add the defaults.
 * rules.
 * @param {boolean=} overwrite Whether to overwrite existing values with the default values. Default: `false`.
 * @returns {object} The target with defaults merged in.
 */
Schema.prototype.addDefaultsToTarget = function (target, overwrite) {
  if (!utils.isObject(target)) {
    throw new Error('Schema#addDefaultsToTarget(target[, overwrite]): target: Must be an object!');
  } else if (!this.defaults) {
    throw new Error('Schema#addDefaultsToTarget(target[, overwrite]): this.defaults: This Schema has no defaults set!');
  } else if (overwrite) {
    utils.deepMixIn(target, this.defaults);
  } else {
    utils.deepFillIn(target, this.defaults);
  }
};

/**
 * @method Schema#setDefaults
 * @desc Set the default values for this Schema.
 * @param {object} attrs The default values for an object of this Schema.
 * @returns {Schema} Reference to this schema.
 */
Schema.prototype.setDefaults = function (attrs) {
  if (!utils.isObject(attrs)) {
    throw new Error('Schema#defaults(attrs): attrs: Must be an object!');
  } else {
    this.defaults = utils.merge({}, attrs);
  }
  return this;
};

/**
 * @method Schema#getDefaults
 * @desc Get the default values for this Schema.
 * @returns {object} The default values for this schema.
 */
Schema.prototype.getDefaults = function () {
  return utils.merge({}, this.defaults);
};

function stripNonSchemaAttrs(attrs, schemaLevel) {
  utils.forOwn(attrs, function (value, key) {
    if (schemaLevel[key]) {
      if (utils.isObject(value) && utils.isObject(schemaLevel[key])) {
        stripNonSchemaAttrs(value, schemaLevel[key]);
      }
    } else {
      utils.unset(attrs, key);
    }
  });
}

/**
 * @method Schema#stripNonSchemaAttrs
 * @desc Strip fields not defined in this schema from the given attributes.
 * @returns {object} The attributes from which to strip non-schema fields.
 */
Schema.prototype.stripNonSchemaAttrs = function (attrs) {
  stripNonSchemaAttrs(attrs, this.schema);
  return attrs;
};
