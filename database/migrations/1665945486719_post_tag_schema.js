'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostTagSchema extends Schema {
  up () {
    this.create('post_tags', (table) => {
      table.increments()
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_tags')
  }
}

module.exports = PostTagSchema
