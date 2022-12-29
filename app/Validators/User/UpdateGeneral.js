class UpdateUserGeneral {
  get rules() {
    return {
      username: 'required',
      email: 'required|email',
    }
  }

  get messages() {
    return {
      'username.required': 'You must provide your username.',
      // 'username.unique': 'User with this username already exists.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      // 'email.unique': 'This email is already registered.',
    }
  }
}

module.exports = UpdateUserGeneral
