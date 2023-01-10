class RoleStore {
  get rules() {
    return {
      name: 'required|unique:role',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'name.required': antl.formatMessage('role.name.required'),
      'name.unique': antl.formatMessage('role.name.unique')
    }
  }
}

module.exports = RoleStore
