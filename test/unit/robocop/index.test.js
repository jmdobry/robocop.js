'use strict';

var robocop;

var Schema = function (name, schema) {
  this.name = name;
  this.schema = schema;
};

Schema.prototype.validate = sinon.stub().callsArg(2);

var defaultRules = {
  succeedTest: function () {
    return true;
  },
  failTest: function () {
    return false;
  }
};

var SandboxedModule = require('sandboxed-module'),
  mout = require('mout');

describe('robocop', function () {

  beforeEach(function (done) {
    robocop = SandboxedModule.require('../../../lib/robocop', {
      requires: {
        './schema': SandboxedModule.require('../../../lib/robocop/schema', {
          requires: {
            '../schema': Schema
          }
        }),
        './rule': SandboxedModule.require('../../../lib/robocop/rule', {
          requires: {
            '../rules': {},
            '../defaultRules': defaultRules
          }
        })
      }
    });
    Schema.prototype.validate = sinon.stub();
    defaultRules.succeedTest = sinon.stub().returns(true);
    defaultRules.failTest = sinon.stub().returns(false);
    done();
  });

  /******** robocop SCHEMA methods *********/
  describe('robocop.defineSchema(name, schema)', function () {
    it('should register and return a new schema', function (done) {
      var newSchema = robocop.defineSchema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      assert.equal(newSchema.name, 'test', 'The name of the new schema should be "test".');
      assert.isTrue(newSchema instanceof Schema, 'The new schema should be an instance of Schema.');
      assert.deepEqual(newSchema.schema, {
        shouldSucceed: {
          succeedTest: true
        }
      });
      assert.deepEqual(robocop.availableSchemas(), ['test'], 'The new schema should be in the registry.');
      done();
    });
    it('should throw an error if the schema already exists', function (done) {
      robocop.defineSchema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      try {
        robocop.defineSchema('test', {
          shouldSucceed: {
            succeedTest: true
          }
        });
        fail('should not reach this!');
      } catch (err) {
        assert.equal(err.toString(), 'Error: robocop.defineSchema(name, schema): name: Name already in use!');
        return done();
      }
      fail('should not reach this!');
    });
  });

  describe('robocop.getSchema(name)', function () {
    it('should return a schema from the registry', function (done) {
      var newSchema = robocop.defineSchema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      assert.deepEqual(robocop.getSchema('test'), newSchema, 'Should return the "test" schema.');
      assert.isUndefined(robocop.getSchema('does not exits'));
      done();
    });
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.getSchema(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.getSchema(name): name: Must be a string!');
        }
      });
      try {
        robocop.getSchema('a string');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
  });

  describe('robocop.availableSchemas()', function () {
    it('should return a list of available schemas in the registry', function (done) {
      robocop.defineSchema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      robocop.defineSchema('test2', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      assert.deepEqual(robocop.availableSchemas(), ['test', 'test2'], 'Should return "test" and "test2".');
      done();
    });
  });

  describe('robocop.removeSchema()', function () {
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.removeSchema(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.removeSchema(name): name: Must be a string!');
        }
      });
      try {
        robocop.removeSchema('a string');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
    it('should remove a schema if it exists', function (done) {
      var newSchema = robocop.defineSchema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });
      assert.deepEqual(robocop.getSchema('test'), newSchema);
      robocop.removeSchema('test');
      assert.isUndefined(robocop.getSchema('test'));
      done();
    });
  });

  /******** robocop RULE methods *********/
  describe('robocop.defineRule(name, ruleFunc[, async])', function () {
    it('should register a new rule', function (done) {
      var ruleFunc = function () {
      };
      robocop.defineRule('test', ruleFunc);
      assert.deepEqual(robocop.getRule('test'), ruleFunc);
      done();
    });
    it('should throw an error if the rule already exists', function (done) {
      robocop.defineRule('test', function () {
      });
      try {
        robocop.defineRule('test', function () {
        });
        fail('should not reach this!');
      } catch (err) {
        assert.equal(err.message, 'robocop.defineRule(name, ruleFunc[, async]): name: Name already in use!');
        return done();
      }
      fail('should not reach this!');
    });
    it('should register a new async rule', function (done) {
      var ruleFunc = function (value, options, done) {
        setTimeout(function () {
          if (typeof value === 'string') {
            done();
          } else {
            done('error');
          }
        }, 200);
      };
      robocop.defineRule('test', ruleFunc, true);
      assert.deepEqual(robocop.getRule('test'), ruleFunc);
      assert.isTrue(robocop.getRule('test').async);

      robocop.getRule('test')('test', null, function (err) {
        assert.isUndefined(err);
        done();
      });
    });
  });

  describe('robocop.getRule(name)', function () {
    it('should return a rule from the registry', function (done) {
      var ruleFunc = function () {
      };
      robocop.defineRule('test', ruleFunc);
      assert.deepEqual(robocop.getRule('test'), ruleFunc, 'Should return the "test" rule.');
      assert.isUndefined(robocop.getSchema('does not exits'));
      done();
    });
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.getRule(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.getRule(name): name: Must be a string!');
        }
      });
      try {
        robocop.getRule('a string');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
  });

  describe('robocop.availableRules()', function () {
    it('should return a list of available rules in the registry', function (done) {
      var ruleFunc = function () {
      };
      robocop.defineRule('test', ruleFunc);
      robocop.defineRule('test2', ruleFunc);
      assert.deepEqual(robocop.availableRules(), ['test', 'test2', 'succeedTest', 'failTest'], 'Should return "test", "test2", "succeedTest" and "failTest".');
      done();
    });
  });

  describe('robocop.removeRule()', function () {
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.removeRule(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.removeRule(name): name: Must be a string!');
        }
      });
      try {
        robocop.removeRule('a string');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
    it('should remove a schema if it exists', function (done) {
      var ruleFunc = function () {
      };
      robocop.defineRule('test', ruleFunc);
      assert.deepEqual(robocop.getRule('test'), ruleFunc);
      robocop.removeRule('test');
      assert.isUndefined(robocop.getRule('test'));
      done();
    });
  });

  /******** robocop DATATYPE methods *********/
  describe('robocop.defineDataType(name, typeDefinition)', function () {
    it('should register a new datatype', function (done) {
      var typeDef = function () {
      };
      robocop.defineDataType('test', typeDef);
      assert.deepEqual(robocop.getDataType('test'), typeDef);
      done();
    });
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.defineDataType(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.defineDataType(name, typeDefinition): name: Must be a string!');
        }
      });
      try {
        robocop.defineDataType('test', function () {
        });
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
    it('should throw an error if the datatype already exists', function (done) {
      robocop.defineDataType('test', function () {
      });
      try {
        robocop.defineDataType('test', function () {
        });
        fail('should not reach this!');
      } catch (err) {
        assert.equal(err.message, 'robocop.defineDataType(name, typeDefinition): name: Name already in use!');
        return done();
      }
      fail('should not reach this!');
    });
  });

  describe('robocop.getDataType(name)', function () {
    it('should return a datatype from the registry', function (done) {
      var typeDef = function () {
      };
      robocop.defineDataType('test', typeDef);
      assert.deepEqual(robocop.getDataType('test'), typeDef);
      done();
    });
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.getDataType(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.getDataType(name): name: Must be a string!');
        }
      });
      try {
        robocop.getDataType('test');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
  });

  describe('robocop.availableDataTypes()', function () {
    it('should return a list of available datatypes', function (done) {
      var typeDef = function () {
      };
      assert.equal(robocop.availableDataTypes().length, 8);
      assert.deepEqual(robocop.availableDataTypes(), [
        'string',
        'number',
        'integer',
        'float',
        'array',
        'object',
        'boolean',
        'date'
      ]);
      robocop.defineDataType('test', typeDef);
      assert.equal(robocop.availableDataTypes().length, 9);
      assert.deepEqual(robocop.availableDataTypes(), [
        'test',
        'string',
        'number',
        'integer',
        'float',
        'array',
        'object',
        'boolean',
        'date'
      ]);
      done();
    });
  });

  describe('robocop.removeDataType()', function () {
    it('should throw an error if name is not a string', function (done) {
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          robocop.removeDataType(val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'robocop.removeDataType(name): name: Must be a string!');
        }
      });
      try {
        robocop.removeDataType('a string');
      } catch (err) {
        fail('should not fail on a string.');
      }
      done();
    });
    it('should remove a schema if it exists', function (done) {
      var typeDef = function () {
      };
      robocop.defineDataType('test', typeDef);
      assert.deepEqual(robocop.getDataType('test'), typeDef);
      robocop.removeDataType('test');
      assert.isUndefined(robocop.getDataType('test'));
      done();
    });
  });
});
