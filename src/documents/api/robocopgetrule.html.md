---
sectionHeader: '.getRule(name)'
sectionName: '&emsp;.getRule(name)'
sectionLinkName: robocopgetrule
gfm: true
index: 9
---
## Description
Retrieve the rule with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the data type to retrieve.

## Usage

```javascript
var DivisibleByRule = robocop.getRule('divisibleBy');

var errors = DivisibleByRule(16, 4);

errors; //  null

errors = DivisibleByRule(17, 4);

errors; //  {
		//      rule: 'divisibleBy',
		//      actual: '17 % 4 === 1',
		//      expected: '17 % 4 === 0'
		//  }
```
