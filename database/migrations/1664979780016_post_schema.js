'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('theme').notNullable()
      table.text('text').notNullable()
      table.string('img_path')
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
