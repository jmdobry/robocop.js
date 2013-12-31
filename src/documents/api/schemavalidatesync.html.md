---
sectionHeader: '.validateSync(attrs[, options])'
sectionName: '&emsp;.validateSync(attrs[, options])'
sectionLinkName: schemavalidatesync
gfm: true
index: 16
---
## Description
Synchronously validate the given attributes against this Schema instance.

## Parameters

#### attrs
__Type:__ `object`

__Required:__ Yes

__Description:__ The hash of attributes to validate.

#### options
__Type:__ `object`

__Required:__ No

__Description:__ Optional configuration.

## Usage

```javascript
var errors = mySchema.validate({
	name: 'John Anderson'
});

errors; // null

errors = mySchema.validate({
	name: 5
});
errors; //  {
		//      name: {
		//          errors: [{
		//              rule: 'type',
		//              actual: 'number',
		//              expected: 'string'
		//          }]
		//      }
		//  }
```
