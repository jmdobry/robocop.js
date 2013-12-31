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
robocop.defineRule('divisibleBy', function (x, divisor) {
	if (typeof x === 'number' && typeof divisor === 'number' && x % divisor !== 0) {
		return {
            rule: 'divisibleBy',
            actual: '' + x + ' % ' + divisor + ' === ' + (x % divisor),
            expected: '' + x + ' % ' + divisor + ' === 0'
        };
	}
	return null;
});
```

#### Define a schema
```javascript
robocop.defineSchema('mySchema', {
	seats: {
		divisibleBy: 4
	}
});

var errors = robocop.getSchema('mySchema').validateSync({
	seats: 16
});

errors; //  null

errors = robocop.getSchema('mySchema').validateSync({
	seats: 17
});

errors; //  {
		//      seats: {
		//          errors: [ {
		//              rule: 'divisibleBy',
		//              actual: '17 % 4 === 1',
		//              expected: '17 % 4 === 0'
		//          } ]
		//      }
		//  }
```

Another example:

```javascript
robocop.defineSchema('person', {
	name: {
		given: {
    		type: 'string',
    		maxLength: 255
    	},
    	surname: {
    		type: 'string',
            maxLength: 255
    	}
	},
	age: {
		type: 'number',
		max: 150,
		min: 0
	}
});
```

#### Validate attributes against a schema
```javascript
var errors = robocop.getSchema('person').validateSync({
	name: {
		given: 'John',
		surname: 'Anderson'
	},
	age: 30
});

errors; // null
```

#### Get an error object when the test fails
```javascript
errors = robocop.getSchema('person').validateSync({
	name: {
		given: 'John',
		surname: 'Anderson'
	},
	age: -4
});

errors; //  {
		//      age: {
		//          errors: [{
		//              rule: 'min',
		//              actual: '150 < 0',
		//              expected: '150 >= 0',
		//          }]
		//      }
		//  }
```
