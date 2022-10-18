'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CommentLike extends Model {
    comment(){
        return this.hasOne('App/Models/Comment')
    }
    user(){
        return this.hasOne('App/Models/User')
    }
}

module.exports = CommentLike
