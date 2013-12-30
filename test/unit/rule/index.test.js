'use strict';

var rules = require('../../../lib/rule');

describe('rules', function () {

	describe('nullable', function () {
		it('should correctly disallow null and undefined values', function (done) {
			assert.isNull(rules.nullable(null, true), 'Should allow null.');
			assert.deepEqual(rules.nullable(null, false), {
				rule: 'nullable',
				actual: 'x === null',
				expected: 'x !== null && x !== undefined'
			}, 'Should disallow null');
			assert.isNull(rules.nullable(undefined, true), 'Should allow undefined.');
			assert.deepEqual(rules.nullable(undefined, false), {
				rule: 'nullable',
				actual: 'x === undefined',
				expected: 'x !== null && x !== undefined'
			}, 'Should disallow undefined.');
			done();
		});

		it('should always allow these values', function (done) {
			assert.isNull(rules.nullable(-100, false), 'Should allow -100.');
			assert.isNull(rules.nullable(-100, true), 'Should allow -100.');
			assert.isNull(rules.nullable(0, false), 'Should allow 0.');
			assert.isNull(rules.nullable(0, true), 'Should allow 0.');
			assert.isNull(rules.nullable(100, false), 'Should allow 100.');
			assert.isNull(rules.nullable(100, true), 'Should allow 100.');
			assert.isNull(rules.nullable('asdf', false), 'Should allow "asdf".');
			assert.isNull(rules.nullable('asdf', true), 'Should allow "asdf".');
			assert.isNull(rules.nullable(false, false), 'Should allow false.');
			assert.isNull(rules.nullable(true), 'Should allow false.');
			assert.isNull(rules.nullable(true, false), 'Should allow true.');
			assert.isNull(rules.nullable(true, true), 'Should allow true.');
			assert.isNull(rules.nullable(new Date(), false), 'Should allow a date.');
			assert.isNull(rules.nullable(new Date(), true), 'Should allow a date.');
			assert.isNull(rules.nullable({}, false), 'Should allow {}.');
			assert.isNull(rules.nullable({}, true), 'Should allow {}.');
			assert.isNull(rules.nullable([], false), 'Should allow [].');
			assert.isNull(rules.nullable([], true), 'Should allow [].');
			assert.isNull(rules.nullable(['stuff'], false), 'Should allow ["stuff"].');
			assert.isNull(rules.nullable(['stuff'], true), 'Should allow ["stuff"].');
			assert.isNull(rules.nullable({'stuff': 'stuff'}, false), 'Should allow {"stuff":"stuff"}.');
			assert.isNull(rules.nullable({'stuff': 'stuff'}, true), 'Should allow {"stuff":"stuff"}.');
			done();
		});
	});

	describe('max', function () {
		it('should accept numbers less than or equal to the max', function (done) {
			assert.isNull(rules.max(40, 40), 'Should allow 40 when max is 40.');
			assert.isNull(rules.max(39.9999, 40), 'Should allow 39.9999 when max is 40.');
			assert.isNull(rules.max(-39.9999, 40), 'Should allow -39.9999 when max is 40.');
			assert.isNull(rules.max(-40.0001, -40), 'Should allow -40.0001 when max is -40.');
			assert.isNull(rules.max(-100, -40), 'Should allow -100 when max is -40.');
			assert.isNull(rules.max('asdf', 40), 'Should return null for "asdf".');
			assert.isNull(rules.max(true, 40), 'Should return null for true.');
			assert.isNull(rules.max(false, 40), 'Should return null for false.');
			assert.isNull(rules.max(null, 40), 'Should return null for null.');
			assert.isNull(rules.max(undefined, 40), 'Should return null for undefined.');
			assert.isNull(rules.max(new Date(), 40), 'Should return null for a date.');
			assert.isNull(rules.max({}, 40), 'Should return null for {}.');
			assert.isNull(rules.max([], 40), 'Should return null for [].');
			assert.isNull(rules.max(['stuff'], 40), 'Should return null for ["stuff"].');
			assert.isNull(rules.max({'stuff': 'stuff'}, 40), 'Should return null for {"stuff":"stuff"}.');
			done();
		});

		it('should disallow numbers greater than the max', function (done) {
			assert.deepEqual(rules.max(40.0001, 40), {
				rule: 'max',
				actual: '40.0001 > 40',
				expected: '40.0001 <= 40'
			}, 'Should disallow 40.0001 when max is 40.');
			assert.deepEqual(rules.max(-39.9999, -40), {
				rule: 'max',
				actual: '-39.9999 > -40',
				expected: '-39.9999 <= -40'
			}, 'Should disallow -39.9999 when max is -40.');
			done();
		});
	});

	describe('min', function () {
		it('should accept numbers greater than or equal to the min', function (done) {
			assert.isNull(rules.min(40, 40), 'Should allow 40 when min is 40.');
			assert.isNull(rules.min(40.0001, 40), 'Should allow 40.0001 when min is 40.');
			assert.isNull(rules.min(-39.9999, -40), 'Should allow -39.9999 when min is -40.');
			assert.isNull(rules.min(-40, -40), 'Should allow -40 when min is -40.');
			assert.isNull(rules.min('asdf', 40), 'Should return null for "asdf".');
			assert.isNull(rules.min(true, 40), 'Should return null for true.');
			assert.isNull(rules.min(false, 40), 'Should return null for false.');
			assert.isNull(rules.min(null, 40), 'Should return null for null.');
			assert.isNull(rules.min(undefined, 40), 'Should return null for undefined.');
			assert.isNull(rules.min(new Date(), 40), 'Should return null for a date.');
			assert.isNull(rules.min({}, 40), 'Should return null for {}.');
			assert.isNull(rules.min([], 40), 'Should return null for [].');
			assert.isNull(rules.min(['stuff'], 40), 'Should return null for ["stuff"].');
			assert.isNull(rules.min({'stuff': 'stuff'}, 40), 'Should return null for {"stuff":"stuff"}.');
			done();
		});

		it('should disallow numbers less than the min', function (done) {
			assert.deepEqual(rules.min(39.9999, 40), {
				rule: 'min',
				actual: '39.9999 < 40',
				expected: '39.9999 >= 40'
			}, 'Should disallow 39.9999 when min is 40.');
			assert.deepEqual(rules.min(-40.0001, -40), {
				rule: 'min',
				actual: '-40.0001 < -40',
				expected: '-40.0001 >= -40'
			}, 'Should disallow -40.0001 when min is -40.');
			done();
		});
	});

	describe('maxLength', function () {
		it('should accept lengths less than or equal to the maxLength', function (done) {
			assert.isNull(rules.maxLength('1234567890', 10), 'Should allow "1234567890" when maxLength is 10.');
			assert.isNull(rules.maxLength('123456789', 10), 'Should allow "123456789" when maxLength is 10.');
			assert.isNull(rules.maxLength('', 0), 'Should allow "" when maxLength is 0.');
			assert.isNull(rules.maxLength(['1', '2'], 2), 'Should allow ["1", "2"] when maxLength is 2.');
			assert.isNull(rules.maxLength([], 0), 'Should allow [] when maxLength is 0.');
			assert.isNull(rules.maxLength(true, 40), 'Should return null for true.');
			assert.isNull(rules.maxLength(false, 40), 'Should return null for false.');
			assert.isNull(rules.maxLength(null, 40), 'Should return null for null.');
			assert.isNull(rules.maxLength(undefined, 40), 'Should return null for undefined.');
			assert.isNull(rules.maxLength(new Date(), 40), 'Should return null for a date.');
			assert.isNull(rules.maxLength({}, 40), 'Should return null for {}.');
			assert.isNull(rules.maxLength({'stuff': 'stuff'}, 40), 'Should return null for {"stuff":"stuff"}.');
			done();
		});

		it('should disallow lengths greater than the maxLength', function (done) {
			assert.deepEqual(rules.maxLength('1234567890', 9), {
				rule: 'maxLength',
				actual: '' + ('1234567890'.length) + '  > ' + 9,
				expected: '' + ('1234567890'.length) + ' <= ' + 9
			}, 'Should disallow "1234567890" when maxLength is 9.');
			assert.deepEqual(rules.maxLength('123456789', 1), {
				rule: 'maxLength',
				actual: '' + ('123456789'.length) + '  > ' + 1,
				expected: '' + ('123456789'.length) + ' <= ' + 1
			}, 'Should disallow "123456789" when maxLength is 1.');
			assert.deepEqual(rules.maxLength('a', 0), {
				rule: 'maxLength',
				actual: '' + ('a'.length) + '  > ' + 0,
				expected: '' + ('a'.length) + ' <= ' + 0
			}, 'Should disallow "a" when maxLength is 0.');
			assert.deepEqual(rules.maxLength(['1', '2', '3'], 2), {
				rule: 'maxLength',
				actual: '' + (['1', '2', '3'].length) + '  > ' + 2,
				expected: '' + (['1', '2', '3'].length) + ' <= ' + 2
			}, 'Should disallow ["1", "2", "3"] when maxLength is 2.');
			assert.deepEqual(rules.maxLength(['1'], 0), {
				rule: 'maxLength',
				actual: '' + (['1'].length) + '  > ' + 0,
				expected: '' + (['1'].length) + ' <= ' + 0
			}, 'Should disallow ["1"] when maxLength is 0.');
			done();
		});
	});

	describe('minLength', function () {
		it('should accept lengths greater than or equal to the minLength', function (done) {
			assert.isNull(rules.minLength('1234567890', 10), 'Should allow "1234567890" when minLength is 10.');
			assert.isNull(rules.minLength('123456789', 1), 'Should allow "123456789" when minLength is 1.');
			assert.isNull(rules.minLength('', 0), 'Should allow "" when minLength is 0.');
			assert.isNull(rules.minLength(['1', '2'], 2), 'Should allow ["1", "2"] when minLength is 2.');
			assert.isNull(rules.minLength([], 0), 'Should allow [] when minLength is 0.');
			assert.isNull(rules.minLength(true, 40), 'Should return null for true.');
			assert.isNull(rules.minLength(false, 40), 'Should return null for false.');
			assert.isNull(rules.minLength(null, 40), 'Should return null for null.');
			assert.isNull(rules.minLength(undefined, 40), 'Should return null for undefined.');
			assert.isNull(rules.minLength(new Date(), 40), 'Should return null for a date.');
			assert.isNull(rules.minLength({}, 40), 'Should return null for {}.');
			assert.isNull(rules.minLength({'stuff': 'stuff'}, 40), 'Should return null for {"stuff":"stuff"}.');
			done();
		});

		it('should disallow lengths less than the minLength', function (done) {
			assert.deepEqual(rules.minLength('1234567890', 11), {
				rule: 'minLength',
				actual: '' + ('1234567890'.length) + ' < ' + 11,
				expected: '' + ('1234567890'.length) + ' >= ' + 11
			}, 'Should disallow "1234567890" when minLength is 11.');
			assert.deepEqual(rules.minLength('', 1), {
				rule: 'minLength',
				actual: '' + (''.length) + ' < ' + 1,
				expected: '' + (''.length) + ' >= ' + 1
			}, 'Should disallow "" when minLength is 1.');
			assert.deepEqual(rules.minLength(['1', '2', '3'], 4), {
				rule: 'minLength',
				actual: '' + (['1', '2', '3'].length) + ' < ' + 4,
				expected: '' + (['1', '2', '3'].length) + ' >= ' + 4
			}, 'Should disallow ["1", "2", "3"] when minLength is 4.');
			assert.deepEqual(rules.minLength([], 1), {
				rule: 'minLength',
				actual: '' + ([].length) + ' < ' + 1,
				expected: '' + ([].length) + ' >= ' + 1
			}, 'Should disallow [] when minLength is 1.');
			done();
		});
	});
});
