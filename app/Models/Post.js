'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
    static boot () {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('afterFetch', (postInstances) => {
            postInstances.forEach(instance => {
                if (instance.text) {
                    instance.reading_time = Math.ceil(instance.text.split(' ').length / 225)  //reading time in minutes 
                }
                else   
                    instance.reading_time = 0
            })
            
        })
    }
    likes(){
        return this.hasMany('App/Models/PostLike')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }
    likeCount(){
        return this.hasMany('App/Models/PostLike').length
    }
    comments(){
        return this.hasMany('App/Models/Comment')
    }
    tags(){
        return this.belongsToMany('App/Models/Tag')
        .pivotTable('post_tags')
    }
}

module.exports = Post
