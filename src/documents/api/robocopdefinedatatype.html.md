---
sectionHeader: '.defineDataType(name, def)'
sectionName: '&emsp;.defineDataType(name, def)'
sectionLinkName: robocopdefinedatatype
gfm: true
index: 5
---
## Description
Register a new data type with robocop.js.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name by which this data type will be identified.

#### typeDefinition
__Type:__ `function`

__Required:__ Yes

__Description:__ Function that accepts the value to be tested. This function should return null if the value is considered valid, otherwise any return value will be used as the error message.

## Usage

```javascript
robocop.defineDataType('NaN', function (x) {
	if (isNaN(x)) {
		return null;
	} else {
		return {
			rule: 'type',
			actual: typeof x,
			expected: 'NaN'
		};
	}
});
```
