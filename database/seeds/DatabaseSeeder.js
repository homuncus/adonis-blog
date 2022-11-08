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
const Hash = use('Hash')
const User = use('App/Models/User')
const Post = use('App/Models/Post')

class DatabaseSeeder {
  async run () {
    await User.create({
      username: 'marselopistola',
      email: 'cot.cotenov@gmail.com',
      password: 'qwer',
      role: 'admin'
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
