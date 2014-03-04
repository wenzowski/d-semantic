var app = module.exports = require('derby').createApp('semantic', __filename)
app.use(require('../../lib'))
app.loadViews(__dirname + '/views')

app.get('/', function (page, model, params, next) {
  page.render()
})

