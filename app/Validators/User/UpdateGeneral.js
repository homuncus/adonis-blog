class UpdateUserGeneral {
  get rules() {
    return {
      username: 'required',
      email: 'required|email',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'username.required': antl.formatMessage('user.username.required'),
      // 'username.unique': 'User with this username already exists.',
      'email.required': antl.formatMessage('user.email.required'),
      'email.email': antl.formatMessage('user.email.email'),
      // 'email.unique': 'This email is already registered.',
    }
  }
}

module.exports = UpdateUserGeneral
