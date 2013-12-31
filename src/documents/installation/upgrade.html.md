---
sectionHeader: Upgrade
sectionName: Upgrade
sectionLinkName: upgrade
gfm: true
index: 3
---
## Transition Details
__AFTER 1.0.0__
See [TRANSITION.md](https://github.com/jmdobry/robocop.js/blob/master/TRANSITION.md) for details on breaking changes between versions.

## Upgrade with Bower
After installing robocop.js with Bower, your `bower.json` file lists robocop.js as a dependency.

```javascript
"dependencies": {
    "robocop.js": "~0.11.0"
}
```

<br>
The command:

`bower install robocop.js -F --save`

will install the latest stable version of robocop.js and save the change to your `bower.json`.

<br>
Alternatively, you can specify the new version you want to install, for example:

`bower install robocop.js#0.11.0 --save`.

<br>
`bower prune` will remove the old installation of robocop.js.

## Upgrade with NPM
After installing robocop.js with NPM, your `package.json` file lists robocop.js as a dependency.

```javascript
"dependencies": {
    "robocop.js": "~0.11.0"
}
```

<br>
The command:

`npm update robocop.js --save`

will install the latest stable version of robocop.js and save the change to your `package.json`.

<br>
Alternatively, you can specify the new version you want to install, for example:

`npm install robocop.js@0.11.0 --save`.

## Upgrade Manually
Download the version of robocop.js you want as specified in the [Download](#download) section.

Remember to update your references to robocop.js.
