class MailMany {
  get rules() {
    return {
      message: 'required',
      users: 'required'
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'message.required': antl.formatMessage('mail.message.required'),
      'users.required': antl.formatMessage('mail.users.required')
    }
  }
}

module.exports = MailMany
