'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
    static boot() {
        super.boot()
        this.addHook('beforeSave', roleInstance => {
            if(!roleInstance.slug){
                roleInstance.slug = roleInstance.name
                    .trim()
                    .replace(' ', '-')
                    .toLowerCase()
            }
        })
    }
    permissions() {
        return this.belongsToMany('App/Models/Permission')
            .pivotModel('App/Models/PermissionRole')
    }
}

module.exports = Role
