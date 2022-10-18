'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/Post')} */
const Post = use('App/Models/Post')
/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/../../app/Models/Comment')} */
const Comment = use('App/Models/Comment')

class Meta {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const newestUsers = await User.query().orderBy('created_at', 'desc').fetch()
    request.meta = {
      userCount: await User.getCount(),
      postCount: await Post.getCount(),
      commentCount: await Comment.getCount(),
      newestUserName: newestUsers.toJSON()[0].username
    }
    await next()
  }
}

module.exports = Meta
