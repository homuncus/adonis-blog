/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const User = use('App/Models/User')

class Access {
  async handle({ request, auth }, next, args) {
    const granted = args.length
      ? auth.user.can(parseInt(args[0], 10)) : !!auth.user.isSuper()

    if (!granted) throw new NotAuthorizedException()
    request.granted = true
    await next()
  }
}

module.exports = Access
