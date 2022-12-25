class PostStore {
  get rules() {
    return {
      title: 'required',
      text: 'required',
    }
  }

  get messages() {
    return {
      'title.required': 'Post should have a title',
      'text.required': 'Post should have a text'
    }
  }
}

module.exports = PostStore
