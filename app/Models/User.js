'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
  posts() {
    return this.hasMany('App/Models/Post')
  }
  comments() {
    return this.hasMany('App/Models/Comment')
  }
  role() {
    return this.belongsTo('App/Models/Role')
  }
  async hasRole(roleName) {
    return (await this.role().fetch().name) === roleName
  }
  async can(permissionName) { //hasPermission
    return !!(await this
      .role()
      .with('permissions')
      .fetch())
      .getRelated('permissions')
      .rows.find(val => val.name.toLowerCase() === permissionName.toLowerCase())
  }
}

module.exports = User
