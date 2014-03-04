var app         = require('./server')
var expressApp  = require('derby-starter/lib/server').setup(app, {})
var webdriver   = require('webdriverjs')

before(function (done) {
  var port = process.env.PORT || 33729
  this.location = "http://localhost:" + port

  var opts = { desiredCapabilities : { browserName : 'phantomjs' } }
  var wd = this.wd = webdriver.remote(opts)

  this.server = require('http').createServer(expressApp)
  this.server.listen(port, function (err) {
    if (err) throw err
    wd.init(done)
  })
})

after(function (done) {
  this.server.close()
  this.wd.end(done)
})

