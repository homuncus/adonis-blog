class PostStore {
  get rules() {
    return {
      title: 'required',
      text: 'required',
    }
  }

  get messages() {
    const { antl } = this.ctx
    return {
      'title.required': antl.formatMessage('validation.post.title.required'),
      'text.required': antl.formatMessage('validation.post.text.required')
    }
  }
}

module.exports = PostStore
