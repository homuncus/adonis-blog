const { ServiceProvider } = require('@adonisjs/fold')

class ViewProvider extends ServiceProvider {
  register() {

  }

  boot() {
    const View = this.app.use('Adonis/Src/View')
    View.global('Access', () => this.app.use('Access'))
  }
}

module.exports = ViewProvider
