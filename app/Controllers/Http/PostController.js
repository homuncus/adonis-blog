const Post = use('App/Models/Post')
const User = use('App/Models/User')
const Comment = use('App/Models/Comment')
const NotFoundException = use('App/Exceptions/NotFoundException')
const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')

const cloudinary = use('App/Services/CloudinaryService');
const Access = use('Config').get('permission')
const Mail = use('Mail')
const Env = use('Env')
const DataTable = use('App/Services/DataTable')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  async index({
    request, response, view, auth
  }) {
    const posts = await Post.query()
      .with('comments')
      .with('likes')
      .with('user')
      .orderBy('created_at')
      .fetch()
    // const admin = await User.findBy('role', 'admin')
    return view.render('index', {
      posts: posts.toJSON(),
      // admin: admin.toJSON(),
      meta: request.meta
    })
  }

  async ajaxIndex({ view }) { // index 2.0
    return view.render('admin.data.posts')
  }

  async ajaxShow({ params }) {
    const { id } = params
    const post = await Post.find(id)
    Post.tags = JSON.stringify(Post.tags)
    return post.toJSON()
  }

  async data({ request, response }) {
    const data = request.get();

    const query = Post
      .query()
      .select([
        'posts.id',
        'posts.title',
        'users.username',
        'posts.created_at'
      ])
      .innerJoin('users', 'users.id', 'posts.user_id')

    const datatable = new DataTable(query, ['posts.title', 'users.username'], data);
    const datatableResponse = await datatable.result();
    return datatableResponse;
  }

  async create({ view }) {
    return view.render('posts/add');
  }

  async store({
    request, response, session, auth
  }) {
    const {
      title, text, tags, share
    } = request.all()
    const img = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    const time1 = new Date()
    const post = new Post()
    // await img.move(Helpers.tmpPath('uploads'), {
    // name: `${new Date().getTime()}.${file.subtype}`
    // })
    // if (!img.moved()) {
    //   session.flash({error: img.error()})
    //   return response.redirect('back')
    // }
    // post.img_path = img.fileName
    if (img) {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        img.tmpPath,
        {
          folder: 'forum/uploads', width: 500, height: 333, crop: 'fill'
        }
      )
      post.img_path = cloudinaryResponse.secure_url
    }
    post.title = title
    post.text = text
    post.tags = tags
    post.user_id = auth.user.id
    await post.save()
    if (share) { // comment in case of accidental email sending
      // send the notification
      const users = await User.query().where('subscribed', true).fetch()
      await Mail
        .send('emails.post_created', { post: post.toJSON() }, (message) => {
          message.from(Env.get('MAIL_USERNAME'))
          users.rows.forEach((user) => {
            message.to(user.email)
          })
          message.subject('A new forum post requires your attention!')
        })
    }
    const time2 = new Date()
    session.flash({
      success: `Sucessfully created a post ${share ? 'and shared it among users ' : ''} in ${(time2 - time1) / 1000} seconds`,
    })

    return response.route('PostController.show', { id: post.id });
  }

  async show({
    params, view, request, auth
  }) {
    const { id } = params
    const post = await Post
      .query()
      .where('id', id)
      .with('user')
      .with('likes')
      .with('comments.user')
      .with('comments.likes')
      .first()
    if (!post) throw new NotFoundException()
    post.is_liked = post.getRelated('likes').rows.filter((like) => like.user_id === auth.user.id).length > 0
    post.getRelated('comments').rows.forEach((comment) => {
      // eslint-disable-next-line no-param-reassign
      comment.is_liked = comment.getRelated('likes').rows.filter((like) => like.user_id === auth.user.id).length > 0
    })
    return view.render('posts.post', {
      post: post.toJSON(),
      meta: request.meta
    })
  }

  async search({ request, view }) {
    const {
      tag, title, time, user
    } = request.all()
    const queryToDisplay = [];
    const query = Post.query();
    if (tag) {
      queryToDisplay.push(tag);
    }
    if (title) {
      query.where('title', 'like', `%${title}%`)
      queryToDisplay.push(title);
    }
    if (time) {
      query.whereRaw(`datediff(day, created_at, ${time}) = '0'`)
      queryToDisplay.push(time)
    }
    if (user) {
      query.where('user_id', user)
      queryToDisplay.push((await User.find(user)).username)
    }

    const posts = await query
      .with('user')
      .with('likes')
      .with('comments')
      .fetch()

    return view.render('posts/search', {
      posts: posts.toJSON(),
      meta: request.meta,
      query: queryToDisplay
    })
  }

  async edit({
    params, request, response, view
  }) {
    const { id } = params
    const post = await Post.find(id)
    // if (auth.user.id !== post.user_id && !await auth.user.can(Access.REDACT_POSTS))
    //   throw new NotAuthorizedException()
    return view.render('posts/edit', { post: post.toJSON() })
  }

  async update({
    params, request, response, session, auth
  }) {
    const { id } = params
    const { title, text, tags } = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const post = await Post.find(id)
    if (!post) throw new NotFoundException()
    // if (auth.user.id !== post.user_id && !await auth.user.can(Access.REDACT_POSTS))
    //   throw new NotAuthorizedException()
    if (title) post.title = title
    if (text) post.text = text
    if (tags) post.tags = tags
    if (img) {
      // await img.move(Helpers.tmpPath('uploads'), {
      //   name: `${new Date().getTime()}.${file.subtype}`
      // })
      // if (!img.moved()) {
      //   throw new RuntimeException
      // }
      const imgFileName = post.img_path.split('/').at(-1)
      const imgId = `forum/uploads/${imgFileName.slice(0, imgFileName.indexOf('.'))}`
      await cloudinary.v2.uploader.destroy(imgId, { invalidate: true, resource_type: 'image' })

      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        img.tmpPath,
        {
          folder: 'forum/uploads', width: 500, height: 333, crop: 'fill'
        }
      )
      post.img_path = cloudinaryResponse.secure_url
    }
    await post.save()
    session.flash({ success: `Updated post "${post.title}"` })
    return response.redirect('back')
  }

  async destroy({
    params, request, response, session, auth
  }) {
    const { id } = params;
    const { share } = request.all()
    const time1 = new Date()
    const post = await Post
      .query()
      .with('comments.user')
      .where('id', id)
      .first()
    if (!post) throw new NotFoundException()
    if (auth.user.id !== post.user_id /* && !await auth.user.can(Access.DELETE_POSTS) */) {
      throw new NotAuthorizedException()
    }
    if (post.img_path) {
      const imgFileName = post.img_path.split('/').at(-1)
      const imgId = `forum/uploads/${imgFileName.slice(0, imgFileName.indexOf('.'))}`
      await cloudinary.v2.uploader.destroy(imgId, { invalidate: true, resource_type: 'image' })
    }
    await post.delete()

    if (share && post.getRelated('comments').rows.length) {
      await Mail
        .send('emails.post_deleted', { post: post.toJSON() }, (message) => {
          message.from(Env.get('EMAIL_USERNAME'))
          post
            .getRelated('comments')
            .rows.forEach((comment) => {
              const user = comment.getRelated('user')
              if (user.id !== auth.user.id) { message.to(user.email) }
            })
          message.subject('Post you participated in was deleted')
        })
    }

    const time2 = new Date()
    session.flash({ success: `Successfully deleted the post in ${(time2 - time1) / 1000} seconds` })
    return response.redirect('/')
  }
}

module.exports = PostController
