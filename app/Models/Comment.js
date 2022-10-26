'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {
    static boot() {
        super.boot()
        this.addHook('afterFetch', commentInstances => {
            commentInstances.forEach(instance => {
                instance.created_at_locale = instance.created_at.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
            })
        })
    }
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
