'use strict';

var dataTypes = require('../../../lib/dataType');

describe('dataTypes', function () {

  describe('string data type', function () {
    it('should be recognized as a string', function (done) {
      assert.isNull(dataTypes.string(''), 'Should recognize "" as a string.');
      assert.isNull(dataTypes.string('asdf'), 'Should recognize "asdf" as a string.');
      done();
    });

    it('should fail to be recognized as a string', function (done) {
      assert.deepEqual(dataTypes.string(0), {
        rule: 'type',
        actual: typeof 0,
        expected: 'string'
      }, 'Should fail to recognize 0 as a string.');
      assert.deepEqual(dataTypes.string(1), {
        rule: 'type',
        actual: typeof 1,
        expected: 'string'
      }, 'Should fail to recognize 1 as a string.');
      assert.deepEqual(dataTypes.string(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'string'
      }, 'Should fail to recognize null as a string.');
      assert.deepEqual(dataTypes.string(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'string'
      }, 'Should fail to recognize undefined as a string.');
      assert.deepEqual(dataTypes.string({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'string'
      }, 'Should fail to recognize {} as a string.');
      assert.deepEqual(dataTypes.string([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'string'
      }, 'Should fail to recognize [] as a string.');
      assert.deepEqual(dataTypes.string(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'string'
      }, 'Should fail to recognize true as a string.');
      assert.deepEqual(dataTypes.string(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'string'
      }, 'Should fail to recognize false as a string.');
      assert.deepEqual(dataTypes.string(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'string'
      }, 'Should fail to recognize a date as a string.');
      done();
    });
  });

  describe('number data type', function () {
    it('should be recognized as a number', function (done) {
      assert.isNull(dataTypes.number(-100), 'Should recognize -100 as a number.');
      assert.isNull(dataTypes.number(-99.9), 'Should recognize -99.9 as a number.');
      assert.isNull(dataTypes.number(-99.1), 'Should recognize -99.1 as a number.');
      assert.isNull(dataTypes.number(-0.75), 'Should recognize -0.75 as a number.');
      assert.isNull(dataTypes.number(-0.25), 'Should recognize -0.25 as a number.');
      assert.isNull(dataTypes.number(0), 'Should recognize 0 as a number.');
      assert.isNull(dataTypes.number(0.25), 'Should recognize 0.25 as a number.');
      assert.isNull(dataTypes.number(0.75), 'Should recognize 0.75 as a number.');
      assert.isNull(dataTypes.number(99.1), 'Should recognize 99.1 as a number.');
      assert.isNull(dataTypes.number(99.9), 'Should recognize 99.9 as a number.');
      assert.isNull(dataTypes.number(100), 'Should recognize 100 as a number.');
      done();
    });

    it('should fail to be recognized as a number', function (done) {
      assert.deepEqual(dataTypes.number(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'number'
      }, 'Should fail to recognize "" as a number.');
      assert.deepEqual(dataTypes.number('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'number'
      }, 'Should fail to recognize "asdf" as a number.');
      assert.deepEqual(dataTypes.number(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'number'
      }, 'Should fail to recognize null as a number.');
      assert.deepEqual(dataTypes.number(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'number'
      }, 'Should fail to recognize undefined as a number.');
      assert.deepEqual(dataTypes.number({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'number'
      }, 'Should fail to recognize {} as a number.');
      assert.deepEqual(dataTypes.number([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'number'
      }, 'Should fail to recognize [] as a number.');
      assert.deepEqual(dataTypes.number(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'number'
      }, 'Should fail to recognize true as a number.');
      assert.deepEqual(dataTypes.number(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'number'
      }, 'Should fail to recognize false as a number.');
      assert.deepEqual(dataTypes.number(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'number'
      }, 'Should fail to recognize a date as a number.');
      done();
    });
  });

  describe('integer data type', function () {
    it('should be recognized as an integer', function (done) {
      assert.isNull(dataTypes.integer(-100), 'Should recognize -100 as an integer.');
      assert.isNull(dataTypes.integer(0), 'Should recognize 0 as an integer.');
      assert.isNull(dataTypes.integer(100), 'Should recognize 100 as an integer.');
      done();
    });

    it('should fail to be recognized as an integer', function (done) {
      assert.deepEqual(dataTypes.integer(-99.9), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize -99.9 as an integer.');
      assert.deepEqual(dataTypes.integer(-99.1), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize -99.1 as an integer.');
      assert.deepEqual(dataTypes.integer(-0.75), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize -0.75 as an integer.');
      assert.deepEqual(dataTypes.integer(-0.25), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize -0.25 as an integer.');
      assert.deepEqual(dataTypes.integer(0.25), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize 0.25 as an integer.');
      assert.deepEqual(dataTypes.integer(0.75), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize 0.75 as an integer.');
      assert.deepEqual(dataTypes.integer(99.1), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize 99.1 as an integer.');
      assert.deepEqual(dataTypes.integer(99.9), {
        rule: 'type',
        actual: 'real',
        expected: 'integer'
      }, 'Should fail to recognize 99.9 as an integer.');
      assert.deepEqual(dataTypes.integer(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'integer'
      }, 'Should fail to recognize "" as an integer.');
      assert.deepEqual(dataTypes.integer('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'integer'
      }, 'Should fail to recognize "asdf" as an integer.');
      assert.deepEqual(dataTypes.integer(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'integer'
      }, 'Should fail to recognize null as an integer.');
      assert.deepEqual(dataTypes.integer(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'integer'
      }, 'Should fail to recognize undefined as an integer.');
      assert.deepEqual(dataTypes.integer({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'integer'
      }, 'Should fail to recognize {} as an integer.');
      assert.deepEqual(dataTypes.integer([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'integer'
      }, 'Should fail to recognize [] as an integer.');
      assert.deepEqual(dataTypes.integer(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'integer'
      }, 'Should fail to recognize true as an integer.');
      assert.deepEqual(dataTypes.integer(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'integer'
      }, 'Should fail to recognize false as an integer.');
      assert.deepEqual(dataTypes.integer(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'integer'
      }, 'Should fail to recognize a date as an integer.');
      done();
    });
  });

  describe('float data type', function () {
    it('should be recognized as a float', function (done) {
      assert.isNull(dataTypes.float(-100), 'Should recognize -100 as a float.');
      assert.isNull(dataTypes.float(0), 'Should recognize 0 as a float.');
      assert.isNull(dataTypes.float(100), 'Should recognize 100 as a float.');
      assert.isNull(dataTypes.float(-99.9), 'Should recognize -99.9 as a float.');
      assert.isNull(dataTypes.float(-99.1), 'Should recognize -99.1 as a float.');
      assert.isNull(dataTypes.float(-0.75), 'Should recognize -0.75 as a float.');
      assert.isNull(dataTypes.float(-0.25), 'Should recognize -0.25 as a float.');
      assert.isNull(dataTypes.float(0.25), 'Should recognize 0.25 as a float.');
      assert.isNull(dataTypes.float(0.75), 'Should recognize 0.75 as a float.');
      assert.isNull(dataTypes.float(99.1), 'Should recognize 99.1 as a float.');
      assert.isNull(dataTypes.float(99.9), 'Should recognize 99.9 as a float.');
      done();
    });

    it('should fail to be recognized as a float', function (done) {
      assert.deepEqual(dataTypes.float(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'float'
      }, 'Should fail to recognize "" as a float.');
      assert.deepEqual(dataTypes.float('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'float'
      }, 'Should fail to recognize "asdf" as a float.');
      assert.deepEqual(dataTypes.float(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'float'
      }, 'Should fail to recognize null as a float.');
      assert.deepEqual(dataTypes.float(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'float'
      }, 'Should fail to recognize undefined as a float.');
      assert.deepEqual(dataTypes.float({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'float'
      }, 'Should fail to recognize {} as a float.');
      assert.deepEqual(dataTypes.float([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'float'
      }, 'Should fail to recognize [] as a float.');
      assert.deepEqual(dataTypes.float(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'float'
      }, 'Should fail to recognize true as a float.');
      assert.deepEqual(dataTypes.float(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'float'
      }, 'Should fail to recognize false as a float.');
      assert.deepEqual(dataTypes.float(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'float'
      }, 'Should fail to recognize a date as a float.');
      done();
    });
  });

  describe('array data type', function () {
    it('should be recognized as an array', function (done) {
      assert.isNull(dataTypes.array([]), 'Should recognize [] as an array.');
      done();
    });

    it('should fail to be recognized as an array', function (done) {
      assert.deepEqual(dataTypes.array(-100), {
        rule: 'type',
        actual: typeof -100,
        expected: 'array'
      }, 'Should fail to recognize -100 as an array.');
      assert.deepEqual(dataTypes.array(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'array'
      }, 'Should fail to recognize "" as an array.');
      assert.deepEqual(dataTypes.array('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'array'
      }, 'Should fail to recognize "asdf" as an array.');
      assert.deepEqual(dataTypes.array(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'array'
      }, 'Should fail to recognize null as an array.');
      assert.deepEqual(dataTypes.array(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'array'
      }, 'Should fail to recognize undefined as an array.');
      assert.deepEqual(dataTypes.array({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'array'
      }, 'Should fail to recognize {} as an array.');
      assert.deepEqual(dataTypes.array(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'array'
      }, 'Should fail to recognize true as an array.');
      assert.deepEqual(dataTypes.array(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'array'
      }, 'Should fail to recognize false as an array.');
      assert.deepEqual(dataTypes.array(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'array'
      }, 'Should fail to recognize a date as an array.');
      done();
    });
  });

  describe('object data type', function () {
    it('should be recognized as an object', function (done) {
      assert.isNull(dataTypes.object({}), 'Should recognize {} as an object.');
      done();
    });

    it('should fail to be recognized as an object', function (done) {
      assert.deepEqual(dataTypes.object(-100), {
        rule: 'type',
        actual: typeof -100,
        expected: 'object'
      }, 'Should fail to recognize -100 as an object.');
      assert.deepEqual(dataTypes.object(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'object'
      }, 'Should fail to recognize "" as an object.');
      assert.deepEqual(dataTypes.object('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'object'
      }, 'Should fail to recognize "asdf" as an object.');
      assert.deepEqual(dataTypes.object(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'object'
      }, 'Should fail to recognize null as an object.');
      assert.deepEqual(dataTypes.object(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'object'
      }, 'Should fail to recognize undefined as an object.');
      assert.deepEqual(dataTypes.object([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'object'
      }, 'Should fail to recognize [] as an object.');
      assert.deepEqual(dataTypes.object(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'object'
      }, 'Should fail to recognize true as an object.');
      assert.deepEqual(dataTypes.object(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'object'
      }, 'Should fail to recognize false as an object.');
      assert.deepEqual(dataTypes.object(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'object'
      }, 'Should fail to recognize a date as an object.');
      done();
    });
  });

  describe('boolean data type', function () {
    it('should be recognized as a boolean', function (done) {
      assert.isNull(dataTypes.boolean(true), 'Should recognize true as an boolean.');
      assert.isNull(dataTypes.boolean(false), 'Should recognize false as an boolean.');
      done();
    });

    it('should fail to be recognized as an boolean', function (done) {
      assert.deepEqual(dataTypes.boolean(-100), {
        rule: 'type',
        actual: typeof -100,
        expected: 'boolean'
      }, 'Should fail to recognize -100 as a boolean.');
      assert.deepEqual(dataTypes.boolean(0), {
        rule: 'type',
        actual: typeof 0,
        expected: 'boolean'
      }, 'Should fail to recognize 0 as a boolean.');
      assert.deepEqual(dataTypes.boolean(100), {
        rule: 'type',
        actual: typeof 100,
        expected: 'boolean'
      }, 'Should fail to recognize 100 as a boolean.');
      assert.deepEqual(dataTypes.boolean(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'boolean'
      }, 'Should fail to recognize "" as a boolean.');
      assert.deepEqual(dataTypes.boolean('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'boolean'
      }, 'Should fail to recognize "asdf" as a boolean.');
      assert.deepEqual(dataTypes.boolean(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'boolean'
      }, 'Should fail to recognize null as a boolean.');
      assert.deepEqual(dataTypes.boolean(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'boolean'
      }, 'Should fail to recognize undefined as a boolean.');
      assert.deepEqual(dataTypes.boolean({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'boolean'
      }, 'Should fail to recognize {} as a boolean.');
      assert.deepEqual(dataTypes.boolean([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'boolean'
      }, 'Should fail to recognize [] as a boolean.');
      assert.deepEqual(dataTypes.boolean(new Date()), {
        rule: 'type',
        actual: typeof new Date(),
        expected: 'boolean'
      }, 'Should fail to recognize a date as a boolean.');
      done();
    });
  });

  describe('date data type', function () {
    it('should be recognized as a date', function (done) {
      assert.isNull(dataTypes.date(new Date()), 'Should recognize a date as a date.');
      done();
    });

    it('should fail to be recognized as a date', function (done) {
      assert.deepEqual(dataTypes.date(-100), {
        rule: 'type',
        actual: typeof -100,
        expected: 'date'
      }, 'Should fail to recognize -100 as a date.');
      assert.deepEqual(dataTypes.date(0), {
        rule: 'type',
        actual: typeof 0,
        expected: 'date'
      }, 'Should fail to recognize 0 as a date.');
      assert.deepEqual(dataTypes.date(100), {
        rule: 'type',
        actual: typeof 100,
        expected: 'date'
      }, 'Should fail to recognize 100 as a date.');
      assert.deepEqual(dataTypes.date(''), {
        rule: 'type',
        actual: typeof '',
        expected: 'date'
      }, 'Should fail to recognize "" as a date.');
      assert.deepEqual(dataTypes.date('asdf'), {
        rule: 'type',
        actual: typeof 'asdf',
        expected: 'date'
      }, 'Should fail to recognize "asdf" as a date.');
      assert.deepEqual(dataTypes.date(null), {
        rule: 'type',
        actual: typeof null,
        expected: 'date'
      }, 'Should fail to recognize null as a date.');
      assert.deepEqual(dataTypes.date(undefined), {
        rule: 'type',
        actual: typeof undefined,
        expected: 'date'
      }, 'Should fail to recognize undefined as a date.');
      assert.deepEqual(dataTypes.date({}), {
        rule: 'type',
        actual: typeof {},
        expected: 'date'
      }, 'Should fail to recognize {} as a date.');
      assert.deepEqual(dataTypes.date([]), {
        rule: 'type',
        actual: typeof [],
        expected: 'date'
      }, 'Should fail to recognize [] as a date.');
      assert.deepEqual(dataTypes.date(true), {
        rule: 'type',
        actual: typeof true,
        expected: 'date'
      }, 'Should recognize true as an date.');
      assert.deepEqual(dataTypes.date(false), {
        rule: 'type',
        actual: typeof false,
        expected: 'date'
      }, 'Should recognize false as an date.');
      done();
    });
  });
});
