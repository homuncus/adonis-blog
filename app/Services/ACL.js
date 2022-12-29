module.exports = class ACL {
  constructor(userPermissions) {
    this.permissions = [].concat(userPermissions)
  }

  has(permission) {
    // if (typeof permission !== 'number') {
    //   throw new Error(`Expected ${permission} to be a number, receieved ${typeof permission}`)
    // }
    return this.permissions.includes(permission)
  }

  hasOneOf(permissions) {
    return !!permissions.find((permission) => this.permissions.includes(permission))
  }

  hasAll(permissions) {
    return permissions.every((permission) => this.permissions.includes(permission))
  }

  hasNot(permission) {
    return !this.has(permission)
  }

  hasNotAny(permissions) {
    return !this.hasOneOf(permissions)
  }
}
