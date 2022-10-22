'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/Comment')} */
const Comment = use('App/Models/Comment')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new comment.
   * GET comments/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session, auth }) {
    const {value, post_id} = request.all()
    const comment = new Comment()
    try{
      comment.value = value
      comment.post_id = post_id
      comment.user_id = auth.user.id
      await comment.save()
      session.flash({success: 'Successfully posted a comment'})
      return response.redirect('back')
    } catch (e) {
      session.flash({error: "something went wrong"})
      return response.redirect('back')
    }
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing comment.
   * GET comments/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  } 

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {id} = params
    const {value} = request.all()
    const comment = await Comment.find(id)
    try{
      comment.value = value
      await comment.save()
      session.flash({success: 'Update successful'})
      return response.redirect('back')
    } catch (e) {
      session.flash({error: 'Something went wrong'})
      return response.redirect('back')
    }
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, session }) {
    const {id} = params
    const comment = await Comment.find(id)
    try { 
      await comment.delete()
      session.flash({success: 'Deletion is successful'})
    } catch(e) {
      session.flash({error: 'Deletion went wrong'})
    }
    response.redirect('back')
  }
}

module.exports = CommentController
