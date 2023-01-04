/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

const Role = use('App/Models/Role')

class User extends Model {
  static async boot() {
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
    return (await this.role().fetch()).name === roleName
  }

  // getters
  static get computed() {
    return ['creationDate', 'roleName']
  }

  // eslint-disable-next-line camelcase
  getCreationDate({ created_at }) {
    return moment(created_at).format('Do MMM, YYYY')
  }

  // async getRoleName({ role_id }) {
  //   return (await Role
  //     .find(role_id)).name
  // }
}

module.exports = User
