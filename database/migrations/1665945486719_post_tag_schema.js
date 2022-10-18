'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostTagSchema extends Schema {
  up () {
    this.create('post_tags', (table) => {
      table.increments()
      table.integer('post_id').notNullable().references('id').inTable('posts')
      table.integer('tag_id').notNullable().references('id').inTable('tags')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_tags')
  }
}

module.exports = PostTagSchema
