---
sectionHeader: '.removeSchema(name)'
sectionName: '&emsp;.removeSchema(name)'
sectionLinkName: robocopremoveschema
gfm: true
index: 13
---
## Description
Remove the schema with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the schema to remove.

## Usage

```javascript
robocop.removeSchema('person');

robocop.getSchema('person') // undefined;
```
