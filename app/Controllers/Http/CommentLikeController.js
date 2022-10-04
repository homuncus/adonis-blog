'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Like = use('App/Models/CommentLike')

/**
 * Resourceful controller for interacting with commentlikes
 */
class CommentLikeController {
  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async store ({ request, response, session }) {
    const {comment_id} = request.all()
    const like = new Like();
    try{
      like.post_id = comment_id
      await like.save()
      session.flash({success: 'Liking successful'})
    } catch(e) {
      session.flash({error: 'Liking unsuccessful'})
    }
    response.redirect('back')
  }

  /**
   * Delete a like with id.
   * DELETE likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const {id} = params
    try{
      const like = await Like.find(id)
      await like.delete()
      session.flash({success: 'Unliking successful'})
    } catch(e) {
      session.flash({success: 'Unliking unsuccessful'})
    }
    response.redirect('back');
  }
}

module.exports = CommentLikeController
