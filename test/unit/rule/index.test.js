'use strict';

var rules = require('../../../lib/rule');

describe('rules', function () {

	describe('canBeEmpty', function () {
		it('should allow empty values when set to true', function (done) {
			assert.isTrue(rules.canBeEmpty('', true), 'Should allow "".');
			assert.isTrue(rules.canBeEmpty({}, true), 'Should allow {}.');
			assert.isTrue(rules.canBeEmpty([], true), 'Should allow [].');
			done();
		});

		it('should disallow empty values when set to false', function (done) {
			assert.isFalse(rules.canBeEmpty('', false), 'Should disallow ""');
			assert.isFalse(rules.canBeEmpty({}, false), 'Should disallow {}');
			assert.isFalse(rules.canBeEmpty([], false), 'Should disallow []');
			done();
		});

		it('should always allow these values', function (done) {
			assert.isTrue(rules.canBeEmpty(-100, false), 'Should allow -100.');
			assert.isTrue(rules.canBeEmpty(-100, true), 'Should allow -100.');
			assert.isTrue(rules.canBeEmpty(0, false), 'Should allow 0.');
			assert.isTrue(rules.canBeEmpty(0, true), 'Should allow 0.');
			assert.isTrue(rules.canBeEmpty(100, false), 'Should allow 100.');
			assert.isTrue(rules.canBeEmpty(100, true), 'Should allow 100.');
			assert.isTrue(rules.canBeEmpty('asdf', false), 'Should allow "asdf".');
			assert.isTrue(rules.canBeEmpty('asdf', true), 'Should allow "asdf".');
			assert.isTrue(rules.canBeEmpty(false, false), 'Should allow false.');
			assert.isTrue(rules.canBeEmpty(true), 'Should allow false.');
			assert.isTrue(rules.canBeEmpty(true, false), 'Should allow true.');
			assert.isTrue(rules.canBeEmpty(true, true), 'Should allow true.');
			assert.isTrue(rules.canBeEmpty(null, false), 'Should allow null.');
			assert.isTrue(rules.canBeEmpty(null, true), 'Should allow null.');
			assert.isTrue(rules.canBeEmpty(undefined, false), 'Should allow undefined.');
			assert.isTrue(rules.canBeEmpty(undefined, true), 'Should allow undefined.');
			assert.isTrue(rules.canBeEmpty(new Date(), false), 'Should allow a date.');
			assert.isTrue(rules.canBeEmpty(new Date(), true), 'Should allow a date.');
			assert.isTrue(rules.canBeEmpty(['stuff'], false), 'Should allow ["stuff"].');
			assert.isTrue(rules.canBeEmpty(['stuff'], true), 'Should allow ["stuff"].');
			assert.isTrue(rules.canBeEmpty({'stuff': 'stuff'}, false), 'Should allow {"stuff":"stuff"}.');
			assert.isTrue(rules.canBeEmpty({'stuff': 'stuff'}, true), 'Should allow {"stuff":"stuff"}.');
			done();
		});
	});

	describe('nullable', function () {
		it('should allow null values when set to true', function (done) {
			assert.isTrue(rules.nullable(null, true), 'Should allow null.');
			done();
		});

		it('should disallow null values when set to false', function (done) {
			assert.isFalse(rules.nullable(null, false), 'Should disallow null');
			done();
		});

		it('should always allow these values', function (done) {
			assert.isTrue(rules.nullable(-100, false), 'Should allow -100.');
			assert.isTrue(rules.nullable(-100, true), 'Should allow -100.');
			assert.isTrue(rules.nullable(0, false), 'Should allow 0.');
			assert.isTrue(rules.nullable(0, true), 'Should allow 0.');
			assert.isTrue(rules.nullable(100, false), 'Should allow 100.');
			assert.isTrue(rules.nullable(100, true), 'Should allow 100.');
			assert.isTrue(rules.nullable('asdf', false), 'Should allow "asdf".');
			assert.isTrue(rules.nullable('asdf', true), 'Should allow "asdf".');
			assert.isTrue(rules.nullable(false, false), 'Should allow false.');
			assert.isTrue(rules.nullable(true), 'Should allow false.');
			assert.isTrue(rules.nullable(true, false), 'Should allow true.');
			assert.isTrue(rules.nullable(true, true), 'Should allow true.');
			assert.isTrue(rules.nullable(undefined, false), 'Should allow undefined.');
			assert.isTrue(rules.nullable(undefined, true), 'Should allow undefined.');
			assert.isTrue(rules.nullable(new Date(), false), 'Should allow a date.');
			assert.isTrue(rules.nullable(new Date(), true), 'Should allow a date.');
			assert.isTrue(rules.nullable({}, false), 'Should allow {}.');
			assert.isTrue(rules.nullable({}, true), 'Should allow {}.');
			assert.isTrue(rules.nullable([], false), 'Should allow [].');
			assert.isTrue(rules.nullable([], true), 'Should allow [].');
			assert.isTrue(rules.nullable(['stuff'], false), 'Should allow ["stuff"].');
			assert.isTrue(rules.nullable(['stuff'], true), 'Should allow ["stuff"].');
			assert.isTrue(rules.nullable({'stuff': 'stuff'}, false), 'Should allow {"stuff":"stuff"}.');
			assert.isTrue(rules.nullable({'stuff': 'stuff'}, true), 'Should allow {"stuff":"stuff"}.');
			done();
		});
	});

	describe('required', function () {
		it('should disallow these values when set to true', function (done) {
			assert.isFalse(rules.required(null, true), 'Should disallow null.');
			assert.isFalse(rules.required(undefined, true), 'Should disallow undefined.');
			assert.isFalse(rules.required('', true), 'Should disallow "".');
			done();
		});

		it('should allow these values when set to false', function (done) {
			assert.isTrue(rules.required(null, false), 'Should allow null.');
			assert.isTrue(rules.required(undefined, false), 'Should allow undefined.');
			assert.isTrue(rules.required('', false), 'Should allow "".');
			done();
		});

		it('should always allow these values', function (done) {
			assert.isTrue(rules.required(-100, false), 'Should allow -100.');
			assert.isTrue(rules.required(-100, true), 'Should allow -100.');
			assert.isTrue(rules.required(0, false), 'Should allow 0.');
			assert.isTrue(rules.required(0, true), 'Should allow 0.');
			assert.isTrue(rules.required(100, false), 'Should allow 100.');
			assert.isTrue(rules.required(100, true), 'Should allow 100.');
			assert.isTrue(rules.required('asdf', false), 'Should allow "asdf".');
			assert.isTrue(rules.required('asdf', true), 'Should allow "asdf".');
			assert.isTrue(rules.required(false, false), 'Should allow false.');
			assert.isTrue(rules.required(true), 'Should allow false.');
			assert.isTrue(rules.required(true, false), 'Should allow true.');
			assert.isTrue(rules.required(true, true), 'Should allow true.');
			assert.isTrue(rules.required(new Date(), false), 'Should allow a date.');
			assert.isTrue(rules.required(new Date(), true), 'Should allow a date.');
			assert.isTrue(rules.required({}, false), 'Should allow {}.');
			assert.isTrue(rules.required({}, true), 'Should allow {}.');
			assert.isTrue(rules.required([], false), 'Should allow [].');
			assert.isTrue(rules.required([], true), 'Should allow [].');
			assert.isTrue(rules.required(['stuff'], false), 'Should allow ["stuff"].');
			assert.isTrue(rules.required(['stuff'], true), 'Should allow ["stuff"].');
			assert.isTrue(rules.required({'stuff': 'stuff'}, false), 'Should allow {"stuff":"stuff"}.');
			assert.isTrue(rules.required({'stuff': 'stuff'}, true), 'Should allow {"stuff":"stuff"}.');
			done();
		});
	});

	describe('max', function () {
		it('should accept numbers less than or equal to the max', function (done) {
			assert.isTrue(rules.max(40, 40), 'Should allow 40 when max is 40.');
			assert.isTrue(rules.max(39.9999, 40), 'Should allow 39.9999 when max is 40.');
			assert.isTrue(rules.max(-39.9999, 40), 'Should allow -39.9999 when max is 40.');
			assert.isTrue(rules.max(-40.0001, -40), 'Should allow -40.0001 when max is -40.');
			assert.isTrue(rules.max(-100, -40), 'Should allow -100 when max is -40.');
			done();
		});

		it('should disallow numbers greater than the max', function (done) {
			assert.isFalse(rules.max(40.0001, 40), 'Should disallow 40.0001 when max is 40.');
			assert.isFalse(rules.max(-39.9999, -40), 'Should disallow -39.9999 when max is -40.');
			done();
		});

		it('should return null if the value is not a number', function (done) {
			assert.strictEqual(rules.max('asdf', 40), null, 'Should return null for "asdf".');
			assert.strictEqual(rules.max(true, 40), null, 'Should return null for true.');
			assert.strictEqual(rules.max(false, 40), null, 'Should return null for false.');
			assert.strictEqual(rules.max(null, 40), null, 'Should return null for null.');
			assert.strictEqual(rules.max(undefined, 40), null, 'Should return null for undefined.');
			assert.strictEqual(rules.max(new Date(), 40), null, 'Should return null for a date.');
			assert.strictEqual(rules.max({}, 40), null, 'Should return null for {}.');
			assert.strictEqual(rules.max([], 40), null, 'Should return null for [].');
			assert.strictEqual(rules.max(['stuff'], 40), null, 'Should return null for ["stuff"].');
			assert.strictEqual(rules.max({'stuff': 'stuff'}, 40), null, 'Should return null for {"stuff":"stuff"}.');
			done();
		});
	});

	describe('min', function () {
		it('should accept numbers greater than or equal to the min', function (done) {
			assert.isTrue(rules.min(40, 40), 'Should allow 40 when min is 40.');
			assert.isTrue(rules.min(40.0001, 40), 'Should allow 40.0001 when min is 40.');
			assert.isTrue(rules.min(-39.9999, -40), 'Should allow -39.9999 when min is -40.');
			assert.isTrue(rules.min(-40, -40), 'Should allow -40 when min is -40.');
			done();
		});

		it('should disallow numbers less than the min', function (done) {
			assert.isFalse(rules.min(39.9999, 40), 'Should disallow 39.9999 when min is 40.');
			assert.isFalse(rules.min(-40.0001, -40), 'Should disallow -40.0001 when min is -40.');
			done();
		});

		it('should return null if the value is not a number', function (done) {
			assert.strictEqual(rules.min('asdf', 40), null, 'Should return null for "asdf".');
			assert.strictEqual(rules.min(true, 40), null, 'Should return null for true.');
			assert.strictEqual(rules.min(false, 40), null, 'Should return null for false.');
			assert.strictEqual(rules.min(null, 40), null, 'Should return null for null.');
			assert.strictEqual(rules.min(undefined, 40), null, 'Should return null for undefined.');
			assert.strictEqual(rules.min(new Date(), 40), null, 'Should return null for a date.');
			assert.strictEqual(rules.min({}, 40), null, 'Should return null for {}.');
			assert.strictEqual(rules.min([], 40), null, 'Should return null for [].');
			assert.strictEqual(rules.min(['stuff'], 40), null, 'Should return null for ["stuff"].');
			assert.strictEqual(rules.min({'stuff': 'stuff'}, 40), null, 'Should return null for {"stuff":"stuff"}.');
			done();
		});
	});

	describe('maxLength', function () {
		it('should accept lengths less than or equal to the maxLength', function (done) {
			assert.isTrue(rules.maxLength('1234567890', 10), 'Should allow "1234567890" when maxLength is 10.');
			assert.isTrue(rules.maxLength('123456789', 10), 'Should allow "123456789" when maxLength is 10.');
			assert.isTrue(rules.maxLength('', 0), 'Should allow "" when maxLength is 0.');
			assert.isTrue(rules.maxLength(['1', '2'], 2), 'Should allow ["1", "2"] when maxLength is 2.');
			assert.isTrue(rules.maxLength([], 0), 'Should allow [] when maxLength is 0.');
			done();
		});

		it('should disallow lengths greater than the maxLength', function (done) {
			assert.isFalse(rules.maxLength('1234567890', 9), 'Should disallow "1234567890" when maxLength is 9.');
			assert.isFalse(rules.maxLength('123456789', 1), 'Should disallow "123456789" when maxLength is 1.');
			assert.isFalse(rules.maxLength('a', 0), 'Should disallow "a" when maxLength is 0.');
			assert.isFalse(rules.maxLength(['1', '2', '3'], 2), 'Should disallow ["1", "2", "3"] when maxLength is 3.');
			assert.isFalse(rules.maxLength(['1'], 0), 'Should disallow [] when maxLength is 1.');
			done();
		});

		it('should return null if the value is not a string or an array', function (done) {
			assert.strictEqual(rules.maxLength(true, 40), null, 'Should return null for true.');
			assert.strictEqual(rules.maxLength(false, 40), null, 'Should return null for false.');
			assert.strictEqual(rules.maxLength(null, 40), null, 'Should return null for null.');
			assert.strictEqual(rules.maxLength(undefined, 40), null, 'Should return null for undefined.');
			assert.strictEqual(rules.maxLength(new Date(), 40), null, 'Should return null for a date.');
			assert.strictEqual(rules.maxLength({}, 40), null, 'Should return null for {}.');
			assert.strictEqual(rules.maxLength({'stuff': 'stuff'}, 40), null, 'Should return null for {"stuff":"stuff"}.');
			done();
		});
	});

	describe('minLength', function () {
		it('should accept lengths greater than or equal to the minLength', function (done) {
			assert.isTrue(rules.minLength('1234567890', 10), 'Should allow "1234567890" when minLength is 10.');
			assert.isTrue(rules.minLength('123456789', 1), 'Should allow "123456789" when minLength is 1.');
			assert.isTrue(rules.minLength('', 0), 'Should allow "" when minLength is 0.');
			assert.isTrue(rules.minLength(['1', '2'], 2), 'Should allow ["1", "2"] when minLength is 2.');
			assert.isTrue(rules.minLength([], 0), 'Should allow [] when minLength is 0.');
			done();
		});

		it('should disallow lengths less than the minLength', function (done) {
			assert.isFalse(rules.minLength('1234567890', 11), 'Should disallow "1234567890" when minLength is 11.');
			assert.isFalse(rules.minLength('', 1), 'Should disallow "" when minLength is 1.');
			assert.isFalse(rules.minLength(['1', '2', '3'], 4), 'Should disallow ["1", "2", "3"] when minLength is 4.');
			assert.isFalse(rules.minLength([], 1), 'Should disallow [] when minLength is 1.');
			done();
		});

		it('should return null if the value is not a string or an array', function (done) {
			assert.strictEqual(rules.minLength(true, 40), null, 'Should return null for true.');
			assert.strictEqual(rules.minLength(false, 40), null, 'Should return null for false.');
			assert.strictEqual(rules.minLength(null, 40), null, 'Should return null for null.');
			assert.strictEqual(rules.minLength(undefined, 40), null, 'Should return null for undefined.');
			assert.strictEqual(rules.minLength(new Date(), 40), null, 'Should return null for a date.');
			assert.strictEqual(rules.minLength({}, 40), null, 'Should return null for {}.');
			assert.strictEqual(rules.minLength({'stuff': 'stuff'}, 40), null, 'Should return null for {"stuff":"stuff"}.');
			done();
		});
	});
});
