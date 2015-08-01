[![Circle CI](https://circleci.com/gh/codesnap-io/codesnap.svg?style=svg)](https://circleci.com/gh/BlaseBallerina/codesnap)

# CodeSnap
GitHub-based technical blogging platform. This repository includes the entire codebase of the website at [codesnap.io](http://www.codesnap.io).


## Gulp TASKS

  We use a couple of gulp tasks:

 `gulp integrate`: see workflow instructions

`gulp`: test and lint code

`gulp watch`: run browsersync and watch client folders to compile

`gulp build`: manually build...the build folder


## Testing

**Unit tests are needed for this website**. This is our current priority.


To run end-to-end [Protractor](https://angular.github.io/protractor/#/) tests:
1. `npm install -g protractor`
2. `webdriver-manager update`
3. `webdriver-manager start`
4. `gulp protractor`


## Contributing

A couple of commands to get you started:
1. `npm install -g bower`
2. `npm install -g gulp`
3. `npm install`
4. `bower update && bower install`
5. `gulp watch`

Requests for app-specific secrets or questions about setting up dev environment can be directed to [us@codesnap.io](mailto:us@codesnap.io), though we have a placeholder env file [here](server/config/env/development.js.placeholder.js). If you are cool, we'd like your help.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
