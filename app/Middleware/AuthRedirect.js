'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthRedirect {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle ({ request, auth, response, session }, next) {
    try{
      await auth.check()
      // call next to advance the request
      await next()  
    } catch(e) {
      session.flash({error: 'You are not logged in'})
      response.redirect('/login')
    }
  }
}

module.exports = AuthRedirect
