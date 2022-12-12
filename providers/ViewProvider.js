'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ViewProvider extends ServiceProvider {
  
  register () {
    //
    // this.app.singleton('Providers/ViewProvider', () => {
    //   const Access = this.app.use('Config').get('permission')
    //   const View = this.app.use('Adonis/Src/View')
    //   View.global('Access', () => Access)
    //   return View
    // })
  }

  boot () {
  }
}

module.exports = ViewProvider
