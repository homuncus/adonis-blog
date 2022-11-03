'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostLikeSchema extends Schema {
  up () {
    this.create('post_likes', (table) => {
      table.increments()
      table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.integer('post_id')
        .notNullable()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.unique(['user_id', 'post_id'])
      table.timestamps()
    })
  }

  down () {
    this.drop('post_likes')
  }
}

module.exports = PostLikeSchema
