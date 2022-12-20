'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class AccessProvider extends ServiceProvider {

  register () {
    this.app.bind('Access', () => this.app.use('Config').get('permission'))
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    //
  }
}

module.exports = AccessProvider
