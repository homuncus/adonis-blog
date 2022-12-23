/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const User = use('App/Models/User')

class Access {
  async handle({ request, auth }, next, args) {
    const granted = args.length
      ? auth.user
        .can(parseInt(args[0], 10)) : !!await auth.user
        .role().fetch()

    if (!granted) throw new NotAuthorizedException()
    await next()
  }
}

module.exports = Access
