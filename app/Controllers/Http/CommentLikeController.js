/** @type {typeof import('@adonisjs/../../app/Models/CommentLike')} */
const Like = use('App/Models/CommentLike')
const NotFoundException = use('App/Exceptions/NotFoundException')

/**
 * Resourceful controller for interacting with commentlikes
 */
class CommentLikeController {
  async like({
    params, response, session, auth
  }) {
    const { id } = params
    const like = new Like();
    like.comment_id = id
    like.user_id = auth.user.id
    await like.save()
    session.flash({ success: 'Liking successful' })
    response.redirect('back')
  }

  async dislike({
    params, request, response, session
  }) {
    const { id } = params
    const like = await Like.findBy('comment_id', id)
    if (!like) throw new NotFoundException()
    await like.delete()
    session.flash({ success: 'Unliking successful' })
    response.redirect('back');
  }
}

module.exports = CommentLikeController
