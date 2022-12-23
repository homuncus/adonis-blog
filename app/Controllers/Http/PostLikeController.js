const Like = use('App/Models/PostLike')
const NotFoundException = use('App/Exceptions/NotFoundException');

class PostLikeController {
  async like({
    params, response, session, auth
  }) {
    const { id } = params

    await Like.create({
      post_id: id,
      user_id: auth.user.id
    })

    session.flash({ success: 'Liking successful' })
    response.redirect('back')
  }

  async dislike({
    params, auth, response, session
  }) {
    const { id } = params

    await Like.query()
      .where({
        post_id: id,
        user_id: auth.user.id
      })
      .delete();

    session.flash({ success: 'Unliking successful' })

    response.redirect('back');
  }
}

module.exports = PostLikeController
