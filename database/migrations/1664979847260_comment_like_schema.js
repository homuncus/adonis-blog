'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentLikeSchema extends Schema {
  up () {
    this.create('comment_likes', (table) => {
      table.increments()
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.integer('comment_id').notNullable().references('id').inTable('comments')
      table.timestamps()
    })
  }

  down () {
    this.drop('comment_likes')
  }
}

module.exports = CommentLikeSchema
