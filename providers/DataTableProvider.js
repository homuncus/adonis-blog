'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class DataTableProvider extends ServiceProvider {

  register () {
    // this.app.bind('DataTables', () => )
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

module.exports = DataTableProvider
