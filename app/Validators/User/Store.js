class StoreUser {
  get rules() {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      confirmPassword: 'equals:{{ password }}'
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'username.required': antl.formatMessage('user.username.required'),
      'username.unique': antl.formatMessage('user.username.unique'),
      'email.required': antl.formatMessage('user.email.required'),
      'email.email': antl.formatMessage('user.email.email'),
      'email.unique': antl.formatMessage('user.email.unique'),
      'password.required': antl.formatMessage('user.password.required'),
      'confirmPassword.equals': antl.formatMessage('user.confirmPassword.equals')
    }
  }
}

module.exports = StoreUser
