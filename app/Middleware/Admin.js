/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Admin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({
    request, auth, response, session
  }, next) {
    if (auth.user.role !== 'admin') {
      session.flash({ error: 'You are not the Admin!' })
      return response.redirect('back')
    }
    // call next to advance the request
    await next()
    return 0;
  }
}

module.exports = Admin
