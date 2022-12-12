'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const User = use('App/Models/User')

class Access {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth }, next, args) {
    const can = args ? 
    await auth.user
      .can(args[0])
      :
    !!await auth.user
      .role().fetch()

    if(!can) throw new NotAuthorizedException()
    await next()
  }
}

module.exports = Access
