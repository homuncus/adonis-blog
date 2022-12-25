class CommentStore {
  get rules() {
    return {
      value: 'required'
    }
  }

  get messages() {
    return {
      'value.required': 'Commentaries cannot be empty'
    }
  }
}

module.exports = CommentStore
