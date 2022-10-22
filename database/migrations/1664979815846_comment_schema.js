'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.text('value').notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
