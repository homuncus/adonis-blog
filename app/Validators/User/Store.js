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
    return {
      'username.required': 'You must provide your username.',
      'username.unique': 'User with this username already exists.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password.',
      'confirmPassword.equals': 'Passwords are not equal.'
    }
  }
}

module.exports = StoreUser
