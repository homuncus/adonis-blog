'use strict'



/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/PostLike')} */
const Like = use('App/Models/PostLike')
const NotFoundException = use('App/Exceptions/NotFoundException');

/**
 * Resourceful controller for interacting with likes
 */
class PostLikeController {
  async like({ params, response, session, auth }) {
    const { id } = params
    const like = new Like();
    like.post_id = id
    like.user_id = auth.user.id
    await like.save()
    session.flash({ success: 'Liking successful' })
    response.redirect('back')
  }

  async dislike({ params, request, response, session }) {
    const { id } = params
    const like = await Like.findBy('post_id', id)
    if (!like) throw new NotFoundException()
    await like.delete()
    session.flash({ success: 'Unliking successful' })
    response.redirect('back');
  }
}

module.exports = PostLikeController
