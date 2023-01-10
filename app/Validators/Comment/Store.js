class CommentStore {
  get rules() {
    return {
      value: 'required'
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'value.required': antl.formatMessage('comment.value.required')
    }
  }
}

module.exports = CommentStore
