'use strict';

// Mock rules
var rules = {
  succeedTest: function () {
    return null;
  },
  failTest: function () {
    return 'fail';
  }
};

var SandboxedModule = require('sandboxed-module'),
  Schema = SandboxedModule.require('../../../lib/schema', {
    requires: {
      'mout/lang': require('mout/lang'), // Real dependency
      'mout/object': require('mout/object'), // Real dependency
      '../rules': rules, // Mock dependency
      '../defaultRules': {}
    }
  }),
  mout = require('mout');

describe('Schema', function () {

  // Reset the stubs/spies for each test
  beforeEach(function (done) {
    rules.succeedTest = sinon.stub().returns(null);
    rules.failTest = sinon.stub().returns('fail');
    done();
  });

  describe('Schema constructor', function () {
    it('should validate name', function () {
      var schema;
      mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
        try {
          schema = new Schema(val, {});
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'Schema(name, schema): name: Must be a string!');
        }
        assert.isUndefined(schema);
      });
      try {
        schema = new Schema('a string', {});
        assert.equal(schema.name, 'a string', 'Should set name correctly.');
      } catch (err) {
        fail('should not fail on a string.');
      }
      assert.isDefined(schema);
    });

    it('validate schema', function () {
      var schema;
      mout.collection.forEach(TYPES_EXCEPT_OBJECT, function (val) {
        try {
          schema = new Schema('name', val);
          fail('should fail on ' + val);
        } catch (err) {
          assert.equal(err.message, 'Schema(name, schema): schema: Must be an object!');
        }
        assert.isUndefined(schema);
      });
      try {
        schema = new Schema('name', {});
        assert.deepEqual(schema.schema, {}, 'Should set schema correctly.');
      } catch (err) {
        fail('should not fail on an object.');
      }
      assert.isDefined(schema);
    });

    it('should throw an error if a rule is improperly configured', function () {
      try {
        var schema = new Schema('name', {
          name: 'string',
          age: 'number',
          address: {
            type: {
              type: 'string',
              maxLength: 45
            },
            city: 'string'
          }
        });
      } catch (err) {
        assert.equal(err.message, 'Schema(name, schema): schema: Rule configuration for rule "type" cannot be an object!')
      }
    });
  });

  describe('Schema#validate', function () {
    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        },
        shouldFail: {
          failTest: true
        }
      });

      schema.validate({
        shouldSucceed: true,
        shouldFail: true
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
        assert.isTrue(rules.succeedTest.calledWith(true, true), 'succeedTest should have been called with [true, true]');
        assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
        assert.isTrue(rules.failTest.calledWith(true, true), 'failTest should have been called with [true, true]');
        assert.deepEqual(errors, {
          shouldFail: {
            errors: [ 'fail' ]
          }
        }, 'errors should be defined when the test fails');
      });
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });

      schema.validate({
        shouldSucceed: true
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
        assert.isTrue(rules.succeedTest.calledWith(true, true), 'succeedTest should have been called with [true, true]');
        assert.equal(rules.failTest.callCount, 0, 'failTest should not have been called');
        assert.isNull(errors, 'errors should be undefined when the test succeeds');
        done();
      });
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldFail: {
          failTest: true
        }
      });

      schema.validate({
        shouldFail: true
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 0, 'succeedTest should not have been called');
        assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
        assert.isTrue(rules.failTest.calledWith(true, true), 'failTest should have been called with [true, true]');
        assert.deepEqual(errors, {
          shouldFail: {
            errors: [ 'fail' ]
          }
        }, 'err should be defined when the test fails');
        done();
      });
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: false
        },
        shouldFail: {
          failTest: false
        }
      });

      schema.validate({
        shouldSucceed: false,
        shouldFail: false
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
        assert.isTrue(rules.succeedTest.calledWith(false, false), 'succeedTest should have been called with [false, false]');
        assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
        assert.isTrue(rules.failTest.calledWith(false, false), 'failTest should have been called with [false, false]');
        assert.deepEqual(errors, {
          shouldFail: {
            errors: [ 'fail' ]
          }
        }, 'errors should be defined when the test fails');
        done();
      });
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        },
        shouldFail: {
          failTest: true
        }
      });

      schema.validate({
        shouldSucceed: false,
        shouldFail: false
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
        assert.isTrue(rules.succeedTest.calledWith(false, true), 'succeedTest should have been called with [false, true]');
        assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
        assert.isTrue(rules.failTest.calledWith(false, true), 'failTest should have been called with [false, true]');
        assert.deepEqual(errors, {
          shouldFail: {
            errors: [ 'fail' ]
          }
        }, 'errors should be defined when the test fails');
        done();
      });
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: false
        },
        shouldFail: {
          failTest: false
        }
      });

      schema.validate({
        shouldSucceed: true,
        shouldFail: true
      }, function (errors) {
        assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
        assert.isTrue(rules.succeedTest.calledWith(true, false), 'succeedTest should have been called with [true, false]');
        assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
        assert.isTrue(rules.failTest.calledWith(true, false), 'failTest should have been called with [true, false]');
        assert.deepEqual(errors, {
          shouldFail: {
            errors: [ 'fail' ]
          }
        }, 'errors should be defined when the test fails');
        done();
      });
    });
  });

  describe('Schema.validateSync(attrs, cb)', function () {
    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        },
        shouldFail: {
          failTest: true
        }
      });

      var errors = schema.validateSync({
        shouldSucceed: true,
        shouldFail: true
      });
      assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
      assert.isTrue(rules.succeedTest.calledWith(true, true), 'succeedTest should have been called with [true, true]');
      assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
      assert.isTrue(rules.failTest.calledWith(true, true), 'failTest should have been called with [true, true]');
      assert.deepEqual(errors, {
        shouldFail: {
          errors: [ 'fail' ]
        }
      }, 'errors should be defined when the test fails');
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        }
      });

      var errors = schema.validateSync({
        shouldSucceed: true
      });
      assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
      assert.isTrue(rules.succeedTest.calledWith(true, true), 'succeedTest should have been called with [true, true]');
      assert.equal(rules.failTest.callCount, 0, 'failTest should not have been called');
      assert.isNull(errors, 'errors should be undefined when the test succeeds');
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldFail: {
          failTest: true
        }
      });

      var errors = schema.validateSync({
        shouldFail: true
      });
      assert.equal(rules.succeedTest.callCount, 0, 'succeedTest should not have been called');
      assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
      assert.isTrue(rules.failTest.calledWith(true, true), 'failTest should have been called with [true, true]');
      assert.deepEqual(errors, {
        shouldFail: {
          errors: [ 'fail' ]
        }
      }, 'err should be defined when the test fails');
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: false
        },
        shouldFail: {
          failTest: false
        }
      });

      var errors = schema.validateSync({
        shouldSucceed: false,
        shouldFail: false
      });
      assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
      assert.isTrue(rules.succeedTest.calledWith(false, false), 'succeedTest should have been called with [false, false]');
      assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
      assert.isTrue(rules.failTest.calledWith(false, false), 'failTest should have been called with [false, false]');
      assert.deepEqual(errors, {
        shouldFail: {
          errors: [ 'fail' ]
        }
      }, 'errors should be defined when the test fails');
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: true
        },
        shouldFail: {
          failTest: true
        }
      });

      var errors = schema.validateSync({
        shouldSucceed: false,
        shouldFail: false
      });
      assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
      assert.isTrue(rules.succeedTest.calledWith(false, true), 'succeedTest should have been called with [false, true]');
      assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
      assert.isTrue(rules.failTest.calledWith(false, true), 'failTest should have been called with [false, true]');
      assert.deepEqual(errors, {
        shouldFail: {
          errors: [ 'fail' ]
        }
      }, 'errors should be defined when the test fails');
      done();
    });

    it('should execute applicable validation rules', function (done) {
      var schema = new Schema('test', {
        shouldSucceed: {
          succeedTest: false
        },
        shouldFail: {
          failTest: false
        }
      });

      var errors = schema.validateSync({
        shouldSucceed: true,
        shouldFail: true
      });

      assert.equal(rules.succeedTest.callCount, 1, 'succeedTest should have been called once');
      assert.isTrue(rules.succeedTest.calledWith(true, false), 'succeedTest should have been called with [true, false]');
      assert.equal(rules.failTest.callCount, 1, 'failTest should have been called once');
      assert.isTrue(rules.failTest.calledWith(true, false), 'failTest should have been called with [true, false]');
      assert.deepEqual(errors, {
        shouldFail: {
          errors: [ 'fail' ]
        }
      }, 'errors should be defined when the test fails');
      done();
    });
  });

  describe('Schema.stripNonSchemaAttrs', function () {
    it('should strip non-schema attributes', function () {
      var schema = new Schema('Person', {
        address: {
          state: {
            type: 'string'
          },
          city: {
            type: 'string'
          },
          line1: {
            type: 'string'
          },
          line2: {
            type: 'string'
          },
          zip: {
            type: 'string'
          }
        },
        profile: {
          name: {
            first: {
              type: 'string'
            },
            last: {
              type: 'string'
            }
          },
          email: {
            type: 'string'
          }
        }
      });

      var answer = {
        address: {
          state: 'TX',
          city: 'Austin',
          line1: '100 S Some Street',
          line2: '',
          zip: '12345'
        },
        profile: {
          name: {
            first: 'John',
            last: 'Anderson'
          },
          email: 'john.anderson@email.com'
        }
      };

      var person = {
        address: {
          state: 'TX',
          city: 'Austin',
          line1: '100 S Some Street',
          line2: '',
          zip: '12345',
          nonSchemaThing: 'nope'
        },
        profile: {
          name: {
            first: 'John',
            anotherNonSchemaThing: 'yep',
            last: 'Anderson'
          },
          YANST: 'stuff',
          email: 'john.anderson@email.com'
        },
        whatIsThis: {
          answer: {
            text: 'there is no answer'
          },
          question: {
            text: 'what was the question'
          },
          maxScore: 100
        },
        lastNonSchemaThing: 'this should be gone'
      };

      var result = schema.stripNonSchemaAttrs(person);
      assert.deepEqual(person, answer, 'non-schema attributes should have been stripped');
      assert.deepEqual(result, answer, 'non-schema attributes should have been stripped');
    });
  });
});
