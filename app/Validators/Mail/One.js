class MailOne {
  get rules() {
    return {
      text: 'required'
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'text.required': antl.formatMessage('mail.text.required')
    }
  }
}

module.exports = MailOne
