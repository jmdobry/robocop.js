# Contributing Guide

- Checkout a new branch based on whatever version branch is available (if none then branch from `master`) and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests
  - Run your tests with `grunt build` or `npm test`
  - When all tests pass, everything's fine
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request
  - Make sure you send the PR to the branch you branched from
  - Travis CI is watching you!
