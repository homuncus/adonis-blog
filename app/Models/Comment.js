'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    likes(){
        return this.hasMany('App/Models/CommentLike')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }
    likeCount(){
        return this.hasMany('App/Models/CommentLike').length
    }
}

module.exports = Comment
