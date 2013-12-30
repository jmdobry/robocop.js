---
sectionHeader: Introduction
sectionName: Introduction
sectionLinkName: introduction
gfm: true
index: 1
---
## What is robocop.js?
robocop.js is a library that allows you to define and validate rules, datatypes and schemata in Node and in the browser. Check it out:

#### Define a rule
```javascript
robocop.defineRule('noBadWords', function (value, options) {
	// This function should return null if value satisfies the rule,
	// otherwise the return value will be the error message
	if (typeof value === 'string') {
		return value.indexOf('bad word') === -1;
	}
	return null;
});
```

#### Define a schema
```javascript
robocop.defineSchema('post', {
	id: {
		type: 'string'
	},
	content: {
		type: 'string',
		maxLength: 5000,
		noBadWords: true // Our custom rule
	},
	title: {
		type: 'string',
		required: true,
		minLength: 3,
		maxLength: 255
	},
	author: {
		type: 'string',
		required: true,
		maxLength: 255
	},
	tags: {
		type: 'array'
	}
});
```

#### Validate an object against a schema
```javascript
var result = robocop.testSchema({
	id: 34,
	content: 'With great power comes great responsibility.',
	title: 'A trustworthy government',
	author: 'Concerned citizen',
	tags: [
		'freedom'
	]
}, {
	name: 'post' // the name of the schema to use in the test
});

result; // null (null is good)
```

#### Get an error object when the test fails
```javascript
var result = robocop.testSchema({
	id: 35,
	content: 'Here is a bad word.',
	title: 'A likely post',
	author: 'gordan fooman',
	tags: 'oops'
}, {
	name: 'post' // the name of the schema to use in the test
});

result; //  { content: { errors: [10] } }
```
