const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const User = use('App/Models/User')
const ACL = use('App/Services/ACL')

class Access {
  async handle({ request, auth, view }, next, args) {
    const role = await auth.user
      .role()
      .with('permissions')
      .first()
    if (!role) {
      auth.user.roleName = 'User'
      await next()
      return
    }
    const permissions = role
      .getRelated('permissions')
      .rows.map((row) => row.permission_id)
    auth.user._permissions = permissions
    auth.user.roleName = role.name

    view.share({
      Access: use('Access'),
      ACL: new ACL(permissions)
    })

    const granted = args.length
      ? permissions.includes(parseInt(args[0], 10)) : !!permissions

    if (!granted) throw new NotAuthorizedException()
    request.granted = true
    await next()
  }
}

module.exports = Access
