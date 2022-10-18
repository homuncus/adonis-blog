'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
    static boot() {
        super.boot()

        this.addHook('beforeSave', (tagInstance) => {
            if(tagInstance.dirty.value){
                tagInstance.value = tagInstance.dirty.value.toLowerCase()
            }
        })
    }
    posts(){
        return this.belongsToMany('App/Models/Post')
        .pivotTable('post_tags')
    }
}

module.exports = Tag
