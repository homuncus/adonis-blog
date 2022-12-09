'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {
    roles(){
        return this.belongsToMany('App/Models/Role')
            .pivotModel('App/Models/PermissionRole')
    }
}

module.exports = Permission
