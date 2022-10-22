'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentLikeSchema extends Schema {
  up () {
    this.create('comment_likes', (table) => {
      table.increments()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('comment_id').notNullable().references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('comment_likes')
  }
}

module.exports = CommentLikeSchema
