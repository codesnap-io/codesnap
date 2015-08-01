[![Circle CI](https://circleci.com/gh/codesnap-io/codesnap.svg?style=svg)](https://circleci.com/gh/BlaseBallerina/codesnap)

# CodeSnap
GitHub-based technical blogging platform


### Gulp TASKS

`gulp integrate`: see workflow instructions
`gulp`: test and lint code
`gulp watch`: run browsersync and watch client folders for compiliation
`gulp build`: manually build dist folder


### Testing

$ npm install -g karma-cli

Karma is a great tool for unit testing, and Protractor is intended for end to end or integration testing. This means that small tests for the logic of your individual controllers, directives, and services should be run using Karma. Big tests in which you have a running instance of your entire application should be run using Protractor. Protractor is intended to run tests from a user's point of view - if your test could be written down as instructions for a human interacting with your application, it should be an end to end test written with Protractor.

To run end-to-end Protractor tests:
$ npm install -g protractor
$ webdriver-manager update
$ webdriver-manager start
`gulp protractor`
