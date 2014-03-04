var gulp = require('gulp')

var allSources = '{lib,test}/*'
var testSources = ['test/*.js']
var selenium = null

var mocha = require('gulp-mocha')
var growl = require('growl')
function runMocha() {
  var opts =
    { growl     : 'true'
    , reporter  : 'spec'
    , timeout   : 30000
    }

  return gulp
    .src(testSources)
    .pipe(mocha(opts))
    .on('error', function (err) {
      var message = (err.message || err)
      growl(message)
      process.stderr.write('\n' + message + '\n')
      if (err.stack) process.stderr.write(err.stack + '\n')
    })
}

gulp.task('test', ['selenium'], function () {
  gulp.on('stop', function () {
    process.nextTick(function () {
      if (selenium) selenium.kill('SIGINT')
      process.exit(0)
    })
  })

  return runMocha()
    .on('error', function (err) {
      if (selenium) selenium.kill('SIGINT')
      process.exit(1)
    })
})

gulp.task('selenium', function (cb) {
  var log = './selenium.log'

  var fs = require('fs')
    , out = fs.openSync(log, 'a')
    , err = fs.openSync(log, 'a')

  var startSelenium = require('selenium-standalone')
    , spawnOptions = { stdio: [0, out, err] }
    , seleniumArgs = [ /* '-debug' */ ]

  selenium = startSelenium(spawnOptions, seleniumArgs)

  var Tail = require('tail').Tail
    , tail = new Tail(log)

  var ready = false

  tail.on('line', function(line) {
    if (ready === false) {
      console.log(line)
      if (line.indexOf('INFO - Started org.openqa.jetty.jetty.Server') !== -1) {
        ready = true
        if (cb) cb()
      }
    }
  })
})

gulp.task('watch', ['selenium'], function() {
  runMocha()
  gulp.watch(allSources, runMocha)
})

gulp.task('default', ['watch'])

