'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostLikeSchema extends Schema {
  up () {
    this.create('post_likes', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.integer('post_id').references('id').inTable('posts')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_likes')
  }
}

module.exports = PostLikeSchema
