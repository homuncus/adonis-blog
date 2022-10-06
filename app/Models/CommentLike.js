'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CommentLike extends Model {
    comment(){
        return this.belongsTo('App/Models/Comment')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }
}

module.exports = CommentLike
