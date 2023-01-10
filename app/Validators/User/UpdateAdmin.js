class UpdateUserAdmin {
  get rules() {
    return {
      username: 'required',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'username.required': antl.formatMessage('user.username.required'),
      // 'username.unique': 'User with this username already exists.',
    }
  }
}

module.exports = UpdateUserAdmin
