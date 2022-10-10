'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
    likes(){
        return this.hasMany('App/Models/PostLike')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }
    likeCount(){
        return this.hasMany('App/Models/PostLike').length
    }
}

module.exports = Post