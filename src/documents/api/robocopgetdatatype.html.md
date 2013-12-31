---
sectionHeader: '.getDataType(name)'
sectionName: '&emsp;.getDataType(name)'
sectionLinkName: robocopgetdatatype
gfm: true
index: 8
---
## Description
Retrieve the data type with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the data type to retrieve.

## Usage

```javascript
var NaNDataType = robocop.getDataType('NaN');

var errors = NaNDataType(30);

errors; //  {
		//      rule: 'type',
		//      actual: 'number',
		//      expected: 'NaN'
		//  }

errors = NaNDataType(NaN);

errors; // null
```
