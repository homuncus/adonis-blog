class MailOne {
  get rules() {
    return {
      text: 'required'
    }
  }

  get messages() {
    return {
      'text.required': 'Please enter the e-mail body'
    }
  }
}

module.exports = MailOne
