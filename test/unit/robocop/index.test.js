'use strict';

var robocop;

var Schema = function (name, schema) {
	this.name = name;
	this.schema = schema;
};

Schema.prototype.validate = sinon.stub().callsArg(2);

var rules = {
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
				'mout/object/deepMixIn': require('mout/object/deepMixIn'),
				'./schema': SandboxedModule.require('../../../lib/robocop/schema', {
					requires: {
						'mout/lang/isString': require('mout/lang/isString'),
						'mout/lang/isObject': require('mout/lang/isObject'),
						'mout/object/keys': require('mout/object/keys'),
						'../schema': Schema
					}
				}),
				'./rule': SandboxedModule.require('../../../lib/robocop/rule', {
					requires: {
						'mout/lang/isString': require('mout/lang/isString'),
						'mout/object/keys': require('mout/object/keys'),
						'../rule': rules
					}
				}),
				'./dataType': SandboxedModule.require('../../../lib/robocop/dataType', {
					requires: {
						'mout/lang/isString': require('mout/lang/isString'),
						'mout/object/keys': require('mout/object/keys'),
						'../dataType': require('../../../lib/dataType')
					}
				})
			}
		});
		Schema.prototype.validate = sinon.stub();
		rules.succeedTest = sinon.stub().returns(true);
		rules.failTest = sinon.stub().returns(false);
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

	describe('robocop.hasSchema(name)', function () {
		it('should return whether a schema is in the registry', function (done) {
			robocop.defineSchema('test', {
				shouldSucceed: {
					succeedTest: true
				}
			});
			assert.isTrue(robocop.hasSchema('test'), 'Should confirm that "test" exists.');
			done();
		});
		it('should throw an error if name is not a string', function (done) {
			mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
				try {
					robocop.hasSchema(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.hasSchema(name): name: Must be a string!');
				}
			});
			try {
				robocop.hasSchema('a string');
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
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

	describe('robocop.testSchema(attrs, options, cb)', function () {
		it('should throw an error if attrs is not an object', function (done) {
			robocop.defineSchema('test', {
				shouldSucceed: {
					succeedTest: true
				}
			});
			mout.collection.forEach(TYPES_EXCEPT_OBJECT, function (val) {
				try {
					robocop.testSchema(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.testSchema(attrs, options, cb): attrs: Must be an object!');
				}
			});
			try {
				robocop.testSchema({
					shouldSucceed: true
				}, {
					name: 'test'
				});
			} catch (err) {
				fail('should not fail on an object.');
			}
			done();
		});
		it('should throw an error if attrs is not an object', function (done) {
			robocop.defineSchema('test', {
				shouldSucceed: {
					succeedTest: true
				}
			});
			mout.collection.forEach(TYPES_EXCEPT_OBJECT, function (val) {
				try {
					robocop.testSchema({
						shouldSucceed: true
					}, val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.testSchema(attrs, options, cb): options: Must be an object!');
				}
			});
			try {
				robocop.testSchema({
					shouldSucceed: true
				}, {
					name: 'test'
				});
			} catch (err) {
				fail('should not fail on an object.');
			}
			done();
		});
		it('should throw an error if the schema does not exist', function (done) {
			robocop.defineSchema('test', {
				shouldSucceed: {
					succeedTest: true
				}
			});
			try {
				robocop.testSchema({
					shouldSucceed: true
				}, {
					name: 'does not exist'
				});
				fail('should not reach this');
			} catch (err) {
				assert.equal(err.message, 'robocop.testSchema(attrs, options, cb): options.name: No schema with that name exists!');
				return done();
			}
			fail('should not reach this.');
		});
		it('should call the validate method of a schema', function (done) {
			var newSchema = robocop.defineSchema('test', {
				shouldSucceed: {
					succeedTest: true
				}
			});
			var errors = robocop.testSchema({
				shouldSucceed: true
			}, {
				name: 'test'
			});
			assert.isUndefined(errors);
			assert.equal(newSchema.validate.callCount, 1, 'Validate should have been called once.');
			done();
		});
	});

	/******** robocop RULE methods *********/
	describe('robocop.defineRule(name, ruleFunc)', function () {
		it('should register a new rule', function (done) {
			var ruleFunc = function () {
			};
			robocop.defineRule('test', ruleFunc);
			assert.deepEqual(robocop.getRule('test'), ruleFunc);
			done();
		});
		it('should throw an error if the schema already exists', function (done) {
			robocop.defineRule('test', function () {
			});
			try {
				robocop.defineRule('test', function () {
				});
				fail('should not reach this!');
			} catch (err) {
				assert.equal(err.message, 'robocop.defineRule(name, ruleFunc): name: Name already in use!');
				return done();
			}
			fail('should not reach this!');
		});
	});

	describe('robocop.hasRule(name)', function () {
		it('should register a new rule', function (done) {
			var ruleFunc = function () {
			};
			robocop.defineRule('test', ruleFunc);
			assert.isTrue(robocop.hasRule('test'), 'Should confirm that "test" exists.');
			done();
		});
		it('should throw an error if name is not a string', function (done) {
			mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
				try {
					robocop.hasRule(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.hasRule(name): name: Must be a string!');
				}
			});
			try {
				robocop.hasRule('a string');
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
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

	describe('robocop.testRule(name, value, options)', function () {
		it('should throw an error if name is not a string', function (done) {
			var ruleFunc = function () {
			};
			robocop.defineRule('test', ruleFunc);
			mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
				try {
					robocop.testRule(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.testRule(name, value, options): name: Must be a string!');
				}
			});
			try {
				robocop.testRule('test', true);
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
		});

		it('should throw an error if the rule does not exist', function (done) {
			var ruleFunc = function () {
			};
			robocop.defineRule('test', ruleFunc);
			try {
				robocop.testRule('does not exist');
				fail('should fail');
			} catch (err) {
				assert.equal(err.message, 'robocop.testRule(name, value, options): name: No rule with that name exists!');
			}
			try {
				robocop.testRule('test', true);
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
		});
	});

	/******** robocop RULE methods *********/
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

	describe('robocop.hasDataType(name)', function () {
		it('should return whether a datatype is in the registry', function (done) {
			assert.isFalse(robocop.hasDataType('test'));
			robocop.defineDataType('test', function () {
			});
			assert.isTrue(robocop.hasDataType('test'));
			done();
		});
		it('should throw an error if name is not a string', function (done) {
			mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
				try {
					robocop.hasDataType(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.hasDataType(name): name: Must be a string!');
				}
			});
			try {
				robocop.hasDataType('test');
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
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

	describe('robocop.testDataType(name, value)', function () {
		it('should throw an error if name is not a string', function (done) {
			robocop.defineDataType('test', function () {
			});
			mout.collection.forEach(TYPES_EXCEPT_STRING, function (val) {
				try {
					robocop.testDataType(val);
					fail('should fail on ' + val);
				} catch (err) {
					assert.equal(err.message, 'robocop.testDataType(name, value): name: Must be a string!');
				}
			});
			try {
				robocop.testDataType('test');
			} catch (err) {
				fail('should not fail on a string.');
			}
			done();
		});
		it('should test a value against a datatype', function (done) {
			var typeDef = sinon.stub().returns(true);
			var typeDef2 = sinon.stub().returns(false);
			robocop.defineDataType('test', typeDef);
			robocop.defineDataType('test2', typeDef2);
			assert.isTrue(robocop.testDataType('test'));
			assert.equal(typeDef.callCount, 1);
			assert.isFalse(robocop.testDataType('test2'));
			assert.equal(typeDef2.callCount, 1);
			done();
		});
	});
});
