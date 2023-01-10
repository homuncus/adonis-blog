class RoleUpdate {
  get rules() {
    return {
      name: 'required',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'name.required': antl.formatMessage('role.name.required'),
      // 'name.unique': 'There is such role name'
    }
  }
}

module.exports = RoleUpdate
