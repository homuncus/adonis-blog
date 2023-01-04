/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostTranslationsSchema extends Schema {
  up() {
    this.create('post_translations', (table) => {
      table.increments()
      table.integer('post_id')
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('locale')
      table.string('title').notNullable()
      table.text('text').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('post_translations')
  }
}

module.exports = PostTranslationsSchema
