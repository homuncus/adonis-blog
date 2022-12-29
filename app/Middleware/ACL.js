const ACL = use('App/Services/ACL')

class Acl {
  async handle({ auth, view }, next) {
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

    await next()
  }
}

module.exports = Acl
