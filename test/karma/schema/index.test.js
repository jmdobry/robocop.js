describe('test', function () {
	it('should', function (done) {
		assert.ok(true);
		done();
	});
});

'use strict';

describe('Schema', function () {

	describe('Schema constructor', function () {
		it('should validate name', function (done) {
			var schema;
			for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
				try {
					schema = new robocop.Schema(TYPES_EXCEPT_STRING[i], {});
					fail('should fail on ' + TYPES_EXCEPT_STRING[i]);
				} catch (err) {
					assert.equal(err.message, 'Schema(name, schema): name: Must be a string!');
				}
				assert.isUndefined(schema);
			}
			try {
				schema = new robocop.Schema('a string', {});
				assert.equal(schema.name, 'a string', 'Should set name correctly.');
			} catch (err) {
				fail('should not fail on a string.');
			}
			assert.isDefined(schema);

			done();
		});

		it('validate schema', function (done) {
			var schema;
			for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
				try {
					schema = new robocop.Schema('name', TYPES_EXCEPT_OBJECT[i]);
					fail('should fail on ' + TYPES_EXCEPT_OBJECT[i]);
				} catch (err) {
					assert.equal(err.message, 'Schema(name, schema): schema: Must be an object!');
				}
				assert.isUndefined(schema);
			}
			try {
				schema = new robocop.Schema('name', {});
				assert.deepEqual(schema.schema, {}, 'Should set schema correctly.');
			} catch (err) {
				fail('should not fail on an object.');
			}
			assert.isDefined(schema);

			done();
		});
	});

	describe('Schema#validate', function () {
		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				},
				shouldFail: {
					type: 'string'
				}
			});

			schema.validate({
				shouldSucceed: 'isastring',
				shouldFail: true
			}, function (errors) {
				assert.deepEqual(errors, {
					shouldFail: {
						errors: [{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}]
					}
				}, 'errors should be defined when the test fails');
			});
			done();
		});

		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			schema.validate({
				shouldSucceed: 'isastring'
			}, function (errors) {
				assert.isNull(errors, 'errors should be undefined when the test succeeds');
				done();
			});
		});

		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldFail: {
					type: 'string'
				}
			});

			schema.validate({
				shouldFail: true
			}, function (errors) {
				assert.deepEqual(errors, {
					shouldFail: {
						errors: [{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}]
					}
				}, 'err should be defined when the test fails');
				done();
			});
		});

		it('should execute applicable nested validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldFail: {
							type: 'string'
						}
					}
				},
				shouldFailAlso: {
					type: 'string'
				}
			});

			schema.validate({
				nested: {
					doubleNested: {
						shouldFail: true
					}
				},
				shouldFailAlso: false
			}, function (errors) {
				assert.deepEqual(errors, {
					nested: {
						doubleNested: {
							shouldFail: {
								errors: [{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}]
							}
						}
					},
					shouldFailAlso: {
						errors: [{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}]
					}
				}, 'err should be defined when the test fails');
				done();
			});
		});

		it('should execute applicable nested validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldSucceed: {
							type: 'string'
						}
					}
				},
				shouldSucceedAlso: {
					type: 'string'
				}
			});

			schema.validate({
				nested: {
					doubleNested: {
						shouldSucceed: 'isastring'
					}
				},
				shouldSucceedAlso: 'isastring'
			}, function (errors) {
				assert.deepEqual(errors, null, 'err should be null when the test succeeds');
				done();
			});
		});
		it('should execute applicable nested validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldFail: {
							type: 'string'
						}
					},
					doubleNested2: {
						shouldFail: {
							max: 45
						}
					}
				},
				shouldFailAlso: {
					maxLength: 4
				}
			});

			schema.validate({
				nested: {
					doubleNested: {
						shouldFail: 2
					},
					doubleNested2: {
						shouldFail: 50
					}
				},
				shouldFailAlso: 'isastring'
			}, function (errors) {
				assert.deepEqual(errors, {
					nested: {
						doubleNested: {
							shouldFail: {
								errors: [{
									rule: 'type',
									actual: 'number',
									expected: 'string'
								}]
							}
						},
						doubleNested2: {
							shouldFail: {
								errors: [{
									rule: 'max',
									actual: '50 > 45',
									expected: '50 <= 45'
								}]
							}
						}
					},
					shouldFailAlso: {
						errors: [{
							rule: 'maxLength',
							actual: '9 > 4',
							expected: '9 <= 4'
						}]
					}
				}, 'err should exist when the test fails');
				done();
			});
		});

		it('should throw an error if no callback is provided', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			try {
				schema.validate({
					shouldSucceed: 'isastring',
					shouldFail: true
				});
				fail('should have failed without a callback!');
			} catch (err) {
				assert.isNotNull(err);
			}

			done();
		});

		it('should return an error if attrs is not an object', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
				schema.validate(TYPES_EXCEPT_OBJECT[i], function (err) {
					assert.equal(err.message, 'Schema#validate(attrs[, options], cb): attrs: Must be an object!');
				});
			}

			done();
		});

		it('should return an error if options is provided and is not an object', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
				if (!TYPES_EXCEPT_OBJECT[i] || TYPES_EXCEPT_OBJECT[i] === true) {
					continue;
				}
				schema.validate({
					shouldSucceed: 'isastring'
				}, TYPES_EXCEPT_OBJECT[i], function (err) {
					assert.equal(err.message, 'Schema#validate(attrs[, options], cb): options: Must be an object!');
				});
			}

			done();
		});
	});

	describe('Schema.validateSync(attrs, cb)', function () {
		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				},
				shouldFail: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				shouldSucceed: 'isastring',
				shouldFail: true
			});
			assert.deepEqual(errors, {
				shouldFail: {
					errors: [{
						rule: 'type',
						actual: typeof true,
						expected: 'string'
					}]
				}
			}, 'errors should be defined when the test fails');
			done();
		});

		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				shouldSucceed: 'isastring'
			});
			assert.isNull(errors, 'errors should be undefined when the test succeeds');
			done();
		});

		it('should execute applicable validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				shouldFail: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				shouldFail: true
			});
			assert.deepEqual(errors, {
				shouldFail: {
					errors: [{
						rule: 'type',
						actual: typeof true,
						expected: 'string'
					}]
				}
			}, 'err should be defined when the test fails');
			done();
		});

		it('should execute applicable nested validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldFail: {
							type: 'string'
						}
					}
				},
				shouldFailAlso: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				nested: {
					doubleNested: {
						shouldFail: true
					}
				},
				shouldFailAlso: true
			});
			assert.deepEqual(errors, {
				nested: {
					doubleNested: {
						shouldFail: {
							errors: [{
								rule: 'type',
								actual: typeof true,
								expected: 'string'
							}]
						}
					}
				},
				shouldFailAlso: {
					errors: [{
						rule: 'type',
						actual: typeof true,
						expected: 'string'
					}]
				}
			}, 'err should be defined when the test fails');
			done();
		});

		it('should execute applicable nested validation rules', function (done) {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldSucceed: {
							type: 'string'
						}
					}
				},
				shouldSucceedAlso: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				nested: {
					doubleNested: {
						shouldSucceed: 'isastring'
					}
				},
				shouldSucceedAlso: 'isastring'
			});
			assert.deepEqual(errors, null, 'err should be null when test succeeds');
			done();
		});

		it('should return an error if attrs is not an object', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
				try {
					schema.validateSync(TYPES_EXCEPT_OBJECT[i]);
				} catch (err) {
					assert.equal(err.message, 'Schema#validateSync(attrs[, options]): attrs: Must be an object!');
				}
			}

			done();
		});

		it('should return an error if options is provided and is not an object', function (done) {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
				if (!TYPES_EXCEPT_OBJECT[i] || TYPES_EXCEPT_OBJECT[i] === true) {
					continue;
				}
				try {
					schema.validateSync({
						shouldSucceed: 'isastring'
					}, TYPES_EXCEPT_OBJECT[i]);
				} catch (err) {
					assert.equal(err.message, 'Schema#validateSync(attrs[, options]): options: Must be an object!');
				}
			}

			done();
		});
	});
});
