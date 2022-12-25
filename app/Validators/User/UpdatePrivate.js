class UpdateUserPrivate {
  get rules() {
    return {
      password: 'required',
      confirmPassword: 'equals:{{ password }}'
    }
  }

  get messages() {
    return {
      'password.required': 'You must provide a password.',
      'confirmPassword.equals': 'Passwords are not equal.'
    }
  }
}

module.exports = UpdateUserPrivate
