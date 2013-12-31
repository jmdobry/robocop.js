---
sectionHeader: '.getSchema(name)'
sectionName: '&emsp;.getSchema(name)'
sectionLinkName: robocopgetschema
gfm: true
index: 10
---
## Description
Retrieve the schema with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the schema to retrieve.

## Usage

```javascript
var PersonSchema = robocop.getSchema('person');

var errors = PersonSchema.validateSync({
	name: {
	    given: 'John',
	    surname: 'Anderson
	},
	age: 30
});

errors; // null
```
