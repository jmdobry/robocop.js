---
sectionHeader: '.availableSchemas()'
sectionName: '&emsp;.availableSchemas()'
sectionLinkName: robocopavailableschemas
gfm: true
index: 4
---
## Description
Return the list of schemas registered with robocop.js.

## Usage
```javascript
// schemas provided by robocop
robocop.availableSchemas();   // []

// define your own, that's the point!
robocop.defineSchema('mySchema', {
	name: {
		type: 'string'
	}
});

robocop.availableSchemas();   // ['mySchema']
```
