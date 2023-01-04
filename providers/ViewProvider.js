const { ServiceProvider } = require('@adonisjs/fold')

class ViewProvider extends ServiceProvider {
  register() {

  }

  boot() {
    const View = this.app.use('Adonis/Src/View')
    View.global('__', function (message, params = null) {
      return this.$presenter.$data.antl.formatMessage(message, params)
    })
  }
}

module.exports = ViewProvider
