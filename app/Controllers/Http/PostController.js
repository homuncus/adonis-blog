const { UserNotFoundException } = require('@adonisjs/auth/src/Exceptions')
const { RuntimeException } = require('@adonisjs/lucid/src/Exceptions')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/Post')} */
const Post = use('App/Models/Post')
/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/../../app/Models/Comment')} */
const Comment = use('App/Models/Comment')
const NotFoundException = use('App/Exceptions/NotFoundException')

const cloudinary = use('App/Services/CloudinaryService');
const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET /
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const posts = await Post.query()
      .with('comments')
      .with('tags')
      .with('likes')
      .with('user')
      .orderBy('created_at')
      .fetch()

    // const admin = await User.findBy('role', 'admin')
    // console.log(posts.rows);
    return view.render('index', {
      posts: posts.toJSON(),
      // admin: admin.toJSON(),
      meta: request.meta
    })
  }

  /**
   * Render a form to be used for creating a new post.
   * GET posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ view }) {
    return view.render('posts/add');
  }

  /**
   * Create/save a new post.
   * POST posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session, auth }) {
    const { title, text } = request.all()
    const img = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

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
    post.user_id = auth.user.id
    await post.save()
    session.flash({ success: 'Sucessfully created a post' })

    return response.redirect('/');
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, view, request, auth }) {
    const { id } = params
    const post = await Post
      .query()
      .where('id', id)
      .with('user')
      .with('likes')
      .first()
    if(!post) throw new NotFoundException()
    post.comments = (await Comment
      .query()
      .where('post_id', post.id)
      .with('user')
      .fetch()).toJSON()
    post.is_liked = post.$relations.likes.rows.filter(like => 
      like.user_id === auth.user.id
    ).length > 0
    return view.render('posts.post', { 
      post: post.toJSON(),
      meta: request.meta
    })
  }

  /**
   * Search for a posts.
   * GET search
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async search({ request, view }) {
    const {
      tag, title, time, user
    } = request.all()
    let queryToDisplay = [];
    let query = Post.query();
    if (tag) {
      query.whereHas('tags', (builder) => {
        builder.where('value', tag)
      })
      queryToDisplay.push(tag);
    }
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
      queryToDisplay.push(title);
    }
    if (time) {
      query = query.where(`datediff(day, created_at, ${time})`, 0)
      queryToDisplay.push(time)
    }
    if (user) {
      query = query.where('user_id', user)
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

  /**
   * Render a form to update an existing post.
   * GET posts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    const { id } = params
    const post = await Post.find(id)
    return view.render('posts/edit', { post: post.toJSON() })
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const { id } = params
    const { title, text } = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const post = await Post.find(id)
    if (title) post.title = title
    if (text) post.text = text
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
    return response.redirect('back')
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const { id } = params;
    const post = await Post.find(id)
    if (!post) throw new NotFoundException()
    const imgFileName = post.img_path.split('/').at(-1)
    const imgId = `forum/uploads/${imgFileName.slice(0, imgFileName.indexOf('.'))}`
    await cloudinary.v2.uploader.destroy(imgId, { invalidate: true, resource_type: 'image' })
    await post.delete()
    return response.redirect('back')
  }
}

module.exports = PostController
