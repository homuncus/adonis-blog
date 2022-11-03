'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')
const User = use('App/Models/User')
const NoSubjectException = use('App/Exceptions/NoSubjectException')

/**
 * Resourceful controller for interacting with admins
 */
class AdminController {
  /**
   * Admin dashboard.
   * GET admin/
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {

    return view.render('admin.index')
  }

  async search({ request, response, view, session }) {
    const { subject, attr, query } = request.all()
    var model;
    switch(subject){
      // TODO: case 'topics':
      case 'posts':
        model = Post; break
      case 'users':
        model = User; break
      default:
        throw new NoSubjectException()
    }
    const items = query ? 
      await model
        .query()
        .where(attr, 'LIKE', `%${query}%`)
        .fetch() 
      :
      await model.all()

    return view.render(`admin.search.${subject}`, {
      items: items.toJSON()
    })
  }

}

module.exports = AdminController
