class UpdateUserPrivate {
  get rules() {
    return {
      password: 'required',
      confirmPassword: 'equals:{{ password }}'
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'password.required': antl.formatMessage('user.password.required'),
      'confirmPassword.equals': antl.formatMessage('user.confirmPassword.equals')
    }
  }
}

module.exports = UpdateUserPrivate
