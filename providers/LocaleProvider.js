const { ServiceProvider } = require('@adonisjs/fold')

class LocaleProvider extends ServiceProvider {
  register() {
    this.app.bind('Locales', () => this.app.use('Config').get('locales'))
  }

  boot() {
    //
  }
}

module.exports = LocaleProvider
