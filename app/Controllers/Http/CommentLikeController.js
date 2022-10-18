'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/CommentLike')} */
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
   async like ({ request, response, session, auth }) {
    const {comment_id} = request.all()
    const like = new Like();
    try{
      like.comment_id = comment_id
      like.user_id = auth.user.id
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
  async dislike ({ params, request, response }) {
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
