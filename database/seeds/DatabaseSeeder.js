'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Role = use('App/Models/Role')
/** @type {import('@adonisjs/../../app/Models/PermissionRole')} */
const PermissionRole = use('App/Models/PermissionRole')

const Access = use('Access')

class DatabaseSeeder {
  async run() {

    const roles = [ //create start roles
      'Administrator',
      'Moderator',
    ]
    await Role.createMany(
      roles.map(roleName => {
        return { name: roleName }
      })
    )

    const permissionRoles = []
    for (const permission in Access) {  //give all permissions to administrator
      permissionRoles.push({ role_id: 1, permission_id: Access[permission] })
    }

    let moderatorPermissions = [1, 2, 3, 4, 6, 7, 8]
    moderatorPermissions.forEach(id => {
      permissionRoles.push({ role_id: 2, permission_id: id })
    })

    await PermissionRole.createMany(permissionRoles)

    await User.create({
      username: 'marselopistola',
      email: 'cot.cotenov@gmail.com',
      password: 'qwer',
      role_id: 1
    })

    await User.create({
      username: 'Ludmula',
      email: 'asd@gmail.com',
      password: 'qwer',
      role_id: 2
    })

    await Post.create({
      title: 'sosiska',
      text: 'asd',
      user_id: 1,
      img_path: 'https://res.cloudinary.com/de74cryl0/image/upload/v1667423621/forum/uploads/qpv8fckgimekjrggcmtv.jpg'
    })

  }
}

module.exports = DatabaseSeeder
