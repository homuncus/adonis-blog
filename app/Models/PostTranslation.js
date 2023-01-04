/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PostTranslation extends Model {
  post() {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = PostTranslation
