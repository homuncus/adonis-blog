/** @type {typeof import('@adonisjs/../../app/Models/Comment')} */
const Comment = use('App/Models/Comment')

const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const NotFoundException = use('App/Exceptions/NotFoundException')
const Access = use('Config').get('permission')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  async store({
    request, response, session, auth
  }) {
    const { value, post_id } = request.all()
    await Comment.create({
      value,
      post_id,
      user_id: auth.user.id
    })
    session.flash({ success: 'Successfully posted a comment' })
    return response.redirect('back')
  }

  async update({
    params, request, response, auth, session
  }) {
    const { id } = params
    const { value } = request.all()
    const comment = await Comment.find(id)
    if (!comment) throw new NotFoundException()
    if (auth.user.id !== comment.user_id && !request.granted) {
      throw new NotAuthorizedException()
    }
    comment.value = value
    await comment.save()
    session.flash({ success: 'Update successful' })
    return response.redirect('back')
  }

  async destroy({
    params, request, response, session, auth
  }) {
    const { id } = params
    const comment = await Comment.find(id)
    if (!comment) throw new NotFoundException()
    if (auth.user.id !== comment.user_id && !request.granted) {
      throw new NotAuthorizedException()
    }
    await comment.delete()
    session.flash({ success: 'Deletion was successful' })
    response.redirect('back')
  }
}

module.exports = CommentController
