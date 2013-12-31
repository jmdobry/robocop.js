---
sectionHeader: '.removeRule(name)'
sectionName: '&emsp;.removeRule(name)'
sectionLinkName: robocopremoverule
gfm: true
index: 12
---
## Description
Remove the rule with the given name from robocop's registry.

## Parameters

#### name
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the rule to remove.

## Usage

```javascript
robocop.removeRule('divisibleBy');

robocop.getRule('divisibleBy') // undefined;
```
