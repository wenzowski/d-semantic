var assert = require('assert')

require('./runserver')

describe('example', function () {
  it('test', function (done) {
    this.wd
      .url(this.location)
      .getTitle(function(err, title) {
        assert.equal(title, 'Derby App')
      })
      .end(done)
  })
})

