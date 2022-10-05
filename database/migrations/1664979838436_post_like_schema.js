'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostLikeSchema extends Schema {
  up () {
    this.create('post_likes', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('post_likes')
  }
}

module.exports = PostLikeSchema
