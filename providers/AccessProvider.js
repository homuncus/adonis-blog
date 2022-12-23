const { ServiceProvider } = require('@adonisjs/fold');

class AccessProvider extends ServiceProvider {
  register() {
    this.app.bind('Access', () => this.app.use('Config').get('permissions'));
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    //
  }
}

module.exports = AccessProvider;
