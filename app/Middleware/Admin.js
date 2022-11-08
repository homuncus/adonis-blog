'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({ auth, response, session }, next) {
    if (auth.user.role !== 'admin' && auth.user.role !== 'moderator') {
      throw new NotAuthorizedException()
    }
    // call next to advance the request
    await next()
  }
}

module.exports = Admin
