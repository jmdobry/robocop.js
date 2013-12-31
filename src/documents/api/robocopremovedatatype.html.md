---
sectionHeader: '.removeDataType(name)'
sectionName: '&emsp;.removeDataType(name)'
sectionLinkName: robocopremovedatatype
gfm: true
index: 11
---
## Description
Remove the data type with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the data type to remove.

## Usage

```javascript
robocop.removeDataType('NaN');

robocop.getDataType('NaN') // undefined;
```
