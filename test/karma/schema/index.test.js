'use strict';

describe('Schema', function () {

	describe('Schema constructor', function () {
		it('should validate name', function () {
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
		});

		it('validate schema', function () {
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
				},
				shouldFail2: {
					nullable: false
				},
				shouldFail3: {
					nullable: false
				},
				shouldFail4: {
					nullable: false
				}
			});

			schema.validate({
				shouldSucceed: 'isastring',
				shouldFail: true,
				shouldFail2: null,
				shouldFail3: undefined
			}, function (errors) {
				assert.deepEqual(errors, {
					shouldFail: {
						errors: [
							{
								rule: 'type',
								actual: typeof true,
								expected: 'string'
							}
						]
					},
					shouldFail2: {
						errors: [
							{
								rule: 'nullable',
								actual: 'x === null',
								expected: 'x !== null && x !== undefined'
							}
						]
					},
					shouldFail3: {
						errors: [
							{
								rule: 'nullable',
								actual: 'x === undefined',
								expected: 'x !== null && x !== undefined'
							}
						]
					},
					shouldFail4: {
						errors: [
							{
								rule: 'nullable',
								actual: 'x === undefined',
								expected: 'x !== null && x !== undefined'
							}
						]
					}
				}, 'errors should be defined when the test fails');
				done();
			});
		});
		it('should execute multiple async validation rules', function (done) {
			robocop.defineRule('asyncString', function (x, options, done) {
				setTimeout(function () {
					if (typeof x !== 'string') {
						done({
							rule: 'asyncString',
							actual: typeof x,
							expected: 'string'
						});
					} else {
						done();
					}
				}, 200);
			}, true);
			robocop.defineRule('asyncMaxLength', function (x, maxLength, done) {
				setTimeout(function () {
					if (x && (typeof x.length === 'number') && x.length > maxLength) {
						done({
							rule: 'asyncMaxLength',
							actual: 'x.length > maxLength',
							expected: 'x.length <= maxLength'
						});
					} else {
						done();
					}
				}, 200);
			}, true);
			robocop.defineRule('asyncNumber', function (x, options, done) {
				setTimeout(function () {
					if (typeof x !== 'number') {
						done({
							rule: 'asyncNumber',
							actual: typeof x,
							expected: 'number'
						});
					} else {
						done();
					}
				}, 200);
			}, true);

			var schema = new robocop.Schema('test', {
				shouldFail: {
					asyncString: true,
					asyncMaxLength: 2
				},
				nested: {
					shouldFail: {
						asyncNumber: true
					}
				}
			});

			schema.validate({
				shouldFail: ['shouldbestring', 'andistoolong', 3],
				nested: {
					shouldFail: 'shouldbeanumber'
				}
			}, function (errors) {
				assert.deepEqual(errors, {
					nested: {
						shouldFail: {
							errors: [
								{
									rule: 'asyncNumber',
									actual: 'string',
									expected: 'number'
								}
							]
						}
					},
					shouldFail: {
						errors: [
							{
								rule: 'asyncString',
								actual: 'object',
								expected: 'string'
							},
							{
								rule: 'asyncMaxLength',
								actual: 'x.length > maxLength',
								expected: 'x.length <= maxLength'
							}
						]
					}
				}, 'errors should be defined when the test fails');
				done();
			});
		});

		it('should execute a mix of rules', function (done) {
			robocop.defineRule('asyncString2', function (x, options, done) {
				setTimeout(function () {
					if (typeof x !== 'string') {
						done({
							rule: 'asyncString',
							actual: typeof x,
							expected: 'string'
						});
					} else {
						done();
					}
				}, 200);
			}, true);
			robocop.defineRule('asyncMaxLength2', function (x, maxLength, done) {
				setTimeout(function () {
					if (x && (typeof x.length === 'number') && x.length > maxLength) {
						done({
							rule: 'asyncMaxLength',
							actual: 'x.length > maxLength',
							expected: 'x.length <= maxLength'
						});
					} else {
						done();
					}
				}, 200);
			}, true);
			robocop.defineRule('asyncNumber2', function (x, options, done) {
				setTimeout(function () {
					if (typeof x !== 'number') {
						done({
							rule: 'asyncNumber',
							actual: typeof x,
							expected: 'number'
						});
					} else {
						done();
					}
				}, 200);
			}, true);

			var schema = new robocop.Schema('test', {
				shouldFail: {
					asyncString2: true,
					type: 'string',
					maxLength: 1,
					asyncMaxLength2: 2
				},
				nested: {
					shouldFail: {
						asyncNumber2: true,
						type: 'number'
					},
					shouldSucceed: {
						type: 'number',
						nullable: true
					}
				},
				willFail: {
					type: 'boolean'
				}
			});

			schema.validate({
				shouldFail: ['shouldbestring', 'andistoolong', 3],
				nested: {
					shouldFail: 'shouldbeanumber'
				},
				willFail: 'shouldBeABoolean'
			}, function (errors) {
				assert.deepEqual(errors, {
					shouldFail: {
						errors: [
							{
								rule: 'type',
								actual: 'object',
								expected: 'string'
							},
							{
								rule: 'maxLength',
								actual: '3 > 1',
								expected: '3 <= 1'
							},
							{
								rule: 'asyncString',
								actual: 'object',
								expected: 'string'
							},
							{
								rule: 'asyncMaxLength',
								actual: 'x.length > maxLength',
								expected: 'x.length <= maxLength'
							}
						]
					},
					willFail: {
						errors: [
							{
								rule: 'type',
								actual: 'string',
								expected: 'boolean'
							}
						]
					},
					nested: {
						shouldFail: {
							errors: [
								{
									rule: 'type',
									actual: 'string',
									expected: 'number'
								},
								{
									rule: 'asyncNumber',
									actual: 'string',
									expected: 'number'
								}
							]
						}
					}
				}, 'errors should be defined when the test fails');
				done();
			});
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
						errors: [
							{
								rule: 'type',
								actual: typeof true,
								expected: 'string'
							}
						]
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
								errors: [
									{
										rule: 'type',
										actual: typeof true,
										expected: 'string'
									}
								]
							}
						}
					},
					shouldFailAlso: {
						errors: [
							{
								rule: 'type',
								actual: typeof true,
								expected: 'string'
							}
						]
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
						},
						shouldFail2: {
							nullable: false
						},
						shouldSucceed: {
							nullable: true,
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
								errors: [
									{
										rule: 'type',
										actual: 'number',
										expected: 'string'
									}
								]
							},
							shouldFail2: {
								errors: [
									{
										rule: 'nullable',
										actual: 'x === undefined',
										expected: 'x !== null && x !== undefined'
									}
								]
							}
						},
						doubleNested2: {
							shouldFail: {
								errors: [
									{
										rule: 'max',
										actual: '50 > 45',
										expected: '50 <= 45'
									}
								]
							}
						}
					},
					shouldFailAlso: {
						errors: [
							{
								rule: 'maxLength',
								actual: '9 > 4',
								expected: '9 <= 4'
							}
						]
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

	describe('Schema#addDefaults', function () {
		it('should add one-level deep defaults', function () {
			var schema = new robocop.Schema('test', {
				defaultString: {
					type: 'string',
					default: 'defaultString'
				},
				defaultNumber: {
					type: 'number'
				}
			}).defaults({
					defaultString: 'defaultString',
					defaultNumber: 5
				});

			var target = {};

			schema.addDefaultsToTarget(target);

			assert.deepEqual(target, {
				defaultString: 'defaultString',
				defaultNumber: 5
			}, 'should add defaults');
		});
		it('should add one-level deep defaults', function () {
			var schema = new robocop.Schema('test', {
				defaultString: {
					type: 'string',
					default: 'defaultString'
				},
				defaultNumber: {
					type: 'number'
				}
			}).defaults({
					defaultString: 'defaultString',
					defaultNumber: 5
				});

			var target = {
				defaultString: 'shouldBeOverwritten'
			};

			schema.addDefaultsToTarget(target, true);

			assert.deepEqual(target, {
				defaultString: 'defaultString',
				defaultNumber: 5
			}, 'should add defaults');
		});

		it('should add nested defaults', function () {
			var schema = new robocop.Schema('test', {
				defaultString: {
					type: 'string'
				},
				defaultNumber: {
					type: 'number'
				},
				nested: {
					doubleNested: {
						defaultString3: {
							type: 'string'
						},
						defaultNumber3: {
							type: 'number'
						}
					},
					defaultString2: {
						type: 'string'
					},
					defaultNumber2: {
						type: 'number'
					}
				}
			}).defaults({
					defaultString: 'defaultString',
					defaultNumber: 5,
					nested: {
						doubleNested: {
							defaultString3: 'defaultString3',
							defaultNumber3: 15
						},
						defaultString2: 'defaultString2',
						defaultNumber2: 10
					}
				});

			var target = {};

			schema.addDefaultsToTarget(target);

			assert.deepEqual(target, {
				defaultString: 'defaultString',
				defaultNumber: 5,
				nested: {
					doubleNested: {
						defaultString3: 'defaultString3',
						defaultNumber3: 15
					},
					defaultString2: 'defaultString2',
					defaultNumber2: 10
				}
			}, 'should add nested defaults');
		});
	});

	describe('Schema.validateSync(attrs, cb)', function () {
		it('should execute applicable validation rules', function () {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				},
				shouldSucceed2: {
					type: 'string',
					nullable: true
				},
				shouldSucceed3: {
					type: 'string',
					nullable: true
				},
				shouldSucceed4: {
					type: 'string',
					nullable: true
				},
				shouldFail: {
					type: 'string'
				},
				shouldFail2: {
					nullable: false
				},
				shouldFail3: {
					nullable: false
				},
				shouldFail4: {
					nullable: false
				}
			});

			var errors = schema.validateSync({
				shouldSucceed: 'isastring',
				shouldSucceed2: null,
				shouldSucceed3: undefined,
				shouldFail: true,
				shouldFail2: null,
				shouldFail3: undefined
			});
			assert.deepEqual(errors, {
				shouldFail: {
					errors: [
						{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}
					]
				},
				shouldFail2: {
					errors: [
						{
							rule: 'nullable',
							actual: 'x === null',
							expected: 'x !== null && x !== undefined'
						}
					]
				},
				shouldFail3: {
					errors: [
						{
							rule: 'nullable',
							actual: 'x === undefined',
							expected: 'x !== null && x !== undefined'
						}
					]
				},
				shouldFail4: {
					errors: [
						{
							rule: 'nullable',
							actual: 'x === undefined',
							expected: 'x !== null && x !== undefined'
						}
					]
				}
			}, 'errors should be defined when the test fails');
		});

		it('should execute applicable validation rules', function () {
			var schema = new robocop.Schema('test', {
				shouldSucceed: {
					type: 'string'
				}
			});

			var errors = schema.validateSync({
				shouldSucceed: 'isastring'
			});
			assert.isNull(errors, 'errors should be undefined when the test succeeds');
		});

		it('should execute applicable validation rules', function () {
			var schema = new robocop.Schema('test', {
				shouldFail: {
					type: 'string'
				},
				shouldFail2: {
					nullable: false
				}
			});

			var errors = schema.validateSync({
				shouldFail: true
			});
			assert.deepEqual(errors, {
				shouldFail: {
					errors: [
						{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}
					]
				},
				shouldFail2: {
					errors: [
						{
							rule: 'nullable',
							actual: 'x === undefined',
							expected: 'x !== null && x !== undefined'
						}
					]
				}
			}, 'err should be defined when the test fails');
		});

		it('should execute applicable nested validation rules', function () {
			var schema = new robocop.Schema('test', {
				nested: {
					doubleNested: {
						shouldFail: {
							type: 'string'
						},
						shouldFail2: {
							nullable: false
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
							errors: [
								{
									rule: 'type',
									actual: typeof true,
									expected: 'string'
								}
							]
						},
						shouldFail2: {
							errors: [
								{
									rule: 'nullable',
									actual: 'x === undefined',
									expected: 'x !== null && x !== undefined'
								}
							]
						}
					}
				},
				shouldFailAlso: {
					errors: [
						{
							rule: 'type',
							actual: typeof true,
							expected: 'string'
						}
					]
				}
			}, 'err should be defined when the test fails');
		});

		it('should execute applicable nested validation rules', function () {
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
		});

		it('should return an error if attrs is not an object', function () {
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
		});

		it('should return an error if options is provided and is not an object', function () {
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
		});
	});
});
