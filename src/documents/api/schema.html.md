---
sectionHeader: 'Schema'
sectionName: 'Schema'
sectionLinkName: schema
gfm: true
index: 14
---
## Description
Schema class used internally by `robocop`. You can use `Schema` directly if you'd like.

## Usage

```javascript
// A standalone schema
var schema = new robocop.Schema('mySchema', {
	name: {
		type: 'string'
	}
});

```

```javascript
// This schema will be saved in robocop's registry
var schema = robocop.defineSchema('mySchema', {
	name: {
		type: 'string'
	}
});

```
