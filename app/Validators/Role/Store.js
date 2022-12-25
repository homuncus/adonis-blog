class RoleStore {
  get rules() {
    return {
      name: 'required|unique:role',
    }
  }

  get messages() {
    return {
      'name.required': 'Please provide role name',
      'name.unique': 'There is such role name'
    }
  }
}

module.exports = RoleStore
