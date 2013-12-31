---
sectionHeader: '.defineSchema(name, def)'
sectionName: '&emsp;.defineSchema(name, def)'
sectionLinkName: robocopdefineschema
gfm: true
index: 7
---
## Description
Register a new schema with robocop.js.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name by which this schema will be identified.

#### definition
__Type:__ `object`

__Required:__ Yes

__Description:__ Object that maps rules to properties.

## Usage

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
