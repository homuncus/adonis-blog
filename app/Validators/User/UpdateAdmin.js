class UpdateUserAdmin {
  get rules() {
    return {
      username: 'required|unique:users',
    }
  }

  get messages() {
    return {
      'username.required': 'You must provide your username.',
      'username.unique': 'User with this username already exists.',
    }
  }
}

module.exports = UpdateUserAdmin