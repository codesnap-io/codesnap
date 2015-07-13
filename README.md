[ ![Codeship Status for BlaseBallerina/crouton](https://codeship.com/projects/d93ce0b0-0960-0133-a4c9-521d3b82cdba/status?branch=master)](https://codeship.com/projects/90580)

# Crouton
GitHub-based technical blogging platform


### Gulp TASKS

`gulp integrate`: see workflow instructions
`gulp`: test and lint code
`gulp watch`: run browsersync and watch client folders for compiliation
`gulp build`: manually build dist folder


### Testing

$ npm install -g karma-cli
$ npm install -g protractor

To run end-to-end protractor tests:
$ webdriver-manager update
$ webdriver-manager start
`gulp protractor`
