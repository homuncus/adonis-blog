'use strict'

const AddUserPermissionHook = exports = module.exports = {}

AddUserPermissionHook.method = async (userInstances) => {
    userInstances.forEach(async instance => {
        if(!instance._permissions){
          const role = 
            await instance
              .role()
              .with('permissions')
              .first()
          const permissions = 
            role
              .getRelated('permissions')
              .rows.map(row => row.permission_id)
          instance.roleName = role.name
          instance._permissions = permissions;
        }
      })
}
