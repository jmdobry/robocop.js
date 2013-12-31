---
sectionHeader: '.defineRule(name, ruleFunc)'
sectionName: '&emsp;.defineRule(name, ruleFunc)'
sectionLinkName: robocopdefinerule
gfm: true
index: 6
---
## Description
Register a new rule with robocop.js.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name by which this rule will be identified.

#### ruleFunc
__Type:__ `function`

__Required:__ Yes

__Description:__ Function that accepts the value to be tested. This function should return null if the value passes the rule's test, otherwise any return value will be used as the error message.

## Usage

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
