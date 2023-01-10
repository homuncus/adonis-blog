class UserLogin {
  get rules() {
    return {
      email: 'required|email',
      password: 'required',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'email.required': antl.formatMessage('user.email.required'),
      'email.email': antl.formatMessage('user.email.email'),
      'password.required': antl.formatMessage('user.password.required'),
    }
  }
}

module.exports = UserLogin
