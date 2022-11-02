'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/PostLike')} */
const Like = use('App/Models/PostLike')
const CodeException = use('App/Exceptions/CodeException')
const NotFoundException = use('App/Exceptions/NotFoundException')

/**
 * Resourceful controller for interacting with likes
 */
class PostLikeController {
  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async like ({ request, response, session, auth }) {
    const {post_id} = request.all()
    if(await Like.create({
      post_id: post_id,
      user_id: auth.user.id
    }))
      session.flash({success: 'Liking successful'})
    else 
      throw new CodeException()
    return response.redirect('back')
  }

  /**
   * Delete a like with id.
   * DELETE likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async dislike ({ params, request, response }) {
    const {id} = params
    const like = await Like.find(id)
    if(!like) throw new NotFoundException()
    if(await like.delete())
      session.flash({success: 'Unliking successful'})
    else
      throw new CodeException()
    return response.redirect('back')
  }
}

module.exports = PostLikeController
