'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Env = use('Env')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('avatar_url').notNullable().defaultTo(Env.get('GUEST_AVATAR_URL'))
      table.string('description')
      table.boolean('subscribed').notNullable().defaultTo(true)
      table.integer('role_id').notNullable().defaultTo(1).references('id').inTable('roles')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
