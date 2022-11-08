'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class Comment extends Model {
  static boot() {
    super.boot()
    this.addHook('afterFetch', comments => {
      comments.forEach(comment => {
        let _diffDays = (new Date() - new Date(comment.created_at)) / (1000 * 60 * 60 * 24)
        if (_diffDays > 1)
          comment.pub_date = moment(comment.created_at).format('MMM Do, YYYY')
        else
          comment.pub_date = moment(comment.created_at).fromNow()
      })

    })
  }

  likes() {
    return this.hasMany('App/Models/CommentLike')
  }
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Comment
