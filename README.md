# Tests Checker Action

This GitHub Action requires writing the tests in Pull Requests, by requesting changes and posting a comment if tests are missing.

To install it, copy and paste the following snippet into your `.github/workflows/require-tests.yml` file.

```yaml
name: 'Require tests if source code is changed'

on:
  pull_request:
    types: [opened]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: infection/tests-checker-action@v1.0.1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<img width="990" alt="tests-checker" src="https://user-images.githubusercontent.com/3725595/45590526-b7f3fa00-b942-11e8-972d-143c0b367017.png">

## Settings

Default values are:

```yaml
comment: 'Could you please add tests to make sure this change works as expected?',
fileExtensions: '.php,.ts,.js,.c,.cs,.cpp,.rb,.java'
testDir: 'tests'
testPattern: ''
```
where

* `comment` - a text that bot will post when it won't find tests in the PR
* `fileExtensions` - extensions of the files that should be treated as a `source code`. Bot will do nothing if you just updating `README.md` because usually no tests are required to cover such change.
* `testDir` - folder, where tests are located. Make sure to set it correctly, otherwise bot will not be able to understand whether the test file was added or not.
* `testPattern` - a shell glob pattern that should match test files. For example, you can set it to `testPattern: *_test.go` and Bot will be able to understand, that added test has this pattern instead of located in `testDir`. `testDir` and `testPattern` are alternatives, however can be used together.

How to override? You can configure the action by overriding any of the settings listed above.

```yaml
- name: Require tests if source code is changed
  uses: infection/tests-checker-action@v1
  with:
    fileExtensions: '.ts,.js'
    testDir: '__tests__'
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Developing and contributing

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  

```bash
$ npm test

 PASS  ./index.test.js
  ✓ test runs (95ms)

...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
