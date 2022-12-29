class RoleUpdate {
  get rules() {
    return {
      name: 'required',
    }
  }

  get messages() {
    return {
      'name.required': 'Please provide role name',
      // 'name.unique': 'There is such role name'
    }
  }
}

module.exports = RoleUpdate
