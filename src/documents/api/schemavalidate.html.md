---
sectionHeader: '.validate(attrs[, options], cb)'
sectionName: '&emsp;.validate(attrs[, options], cb)'
sectionLinkName: schemavalidate
gfm: true
index: 15
---
## Description
Validate the given attributes against this Schema instance.

## Parameters

#### attrs
__Type:__ `object`

__Required:__ Yes

__Description:__ The hash of attributes to validate.

#### options
__Type:__ `object`

__Required:__ No

__Description:__ Optional configuration.

#### cb
__Type:__ `function`

__Required:__ Yes

__Description:__ Callback function. Signature: `cb(err)`. `err` will be null if validation succeeds.

## Usage

```javascript
mySchema.validate({
	name: 'John Anderson'
}, function (err) {
	err; // null
});

mySchema.validate({
	name: 5
}, function (err) {
	err;    //  {
			//      name: {
			//          errors: [{
			//              rule: 'type',
			//              actual: 'number',
			//              expected: 'string'
			//          }]
			//      }
			//  }
});
```
