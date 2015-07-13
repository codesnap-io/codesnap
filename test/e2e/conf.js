// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/home.js', 'specs/signup.js'],
  multiCapabilities: [
    {browserName: 'chrome'}
  ]
}
