class MailMany {
  get rules() {
    return {
      message: 'required',
      users: 'required'
    }
  }

  get messages() {
    return {
      'message.required': 'Please enter the e-mail body',
      'users.required': 'Select at least one user to e-mail'
    }
  }
}

module.exports = MailMany
