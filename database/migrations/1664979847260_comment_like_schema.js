'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentLikeSchema extends Schema {
  up () {
    this.create('comment_likes', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('comment_likes')
  }
}

module.exports = CommentLikeSchema
