'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')
const User = use('App/Models/User')
const NoSubjectException = use('App/Exceptions/NoSubjectException')
const NotFoundException = use('App/Exceptions/NotFoundException')

/**
 * Resourceful controller for interacting with admins
 */
class AdminController {

  async index({ request, response, view }) {

    return view.render('admin.index')
  }

  async search({ request, response, view, session }) {
    const { attr, query } = request.all()
    const subject = request.url().split('/').at(-1)
    var model;
    switch (subject) {
      // TODO: case 'topics':
      case 'posts':
        model = Post.query().with('user'); break
      case 'users':
        model = User.query(); break
      default:
        throw new NoSubjectException()
    }

    const timeBefore = new Date()
    const items = query ?
      await model
        .where(attr, 'LIKE', `%${query}%`)
        .fetch()
      :
      await model.fetch()
    const timeAfter = new Date()

    return view.render(`admin.search.${subject}`, {
      items: items.toJSON(),
      executionTime: (timeAfter - timeBefore) / 1000
    })
  }

  async showUser({ params, view }) {
    const { id } = params
    const user = await User
      .query()
      .where('id', id)
      .with('posts.comments.user')
      .first()
    if (!user) throw new NotFoundException()
    return view.render('admin.profile', { user: user.toJSON() })
  }

  async updateUser({ params, request, response }) {
    const { id } = params
    const { role } = request.all()
    if(!role) return response.redirect('back')
    const user = await User.find(id)
    if(!user) throw new NotFoundException()
    user.role = role
    await user.save()
    return response.redirect('back')
  }
}

module.exports = AdminController
