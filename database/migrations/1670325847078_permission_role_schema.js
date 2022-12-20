'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionRoleSchema extends Schema {
  up () {
    this.create('permission_role', (table) => {
      table.increments()
      table.integer('role_id')
        .notNullable()
        .references('id')
        .inTable('roles')
      table.integer('permission_id').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('permission_role')
  }
}

module.exports = PermissionRoleSchema
