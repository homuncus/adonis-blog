'use strict'

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

const CloudinaryService = use('App/Services/CloudinaryService');
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
  async index ({ request, response, view }) {
    const posts = await Post.query().with('comments').with('tags').with('likes').with('user').fetch()
    return view.render('index', {
      posts: posts.toJSON(),
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
  async create ({ request, response, view }) {
    return view.render('post_add');
  }

  /**
   * Create/save a new post.
   * POST posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session, auth }) {
    const {title, text} = request.all()
    const img = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    try{
      const post = new Post()
        // await img.move(Helpers.tmpPath('uploads'), {
        // name: `${new Date().getTime()}.${file.subtype}`
        // })
        // if (!img.moved()) {
        //   session.flash({error: img.error()})
        //   return response.redirect('back')
        // }
        // post.img_path = img.fileName
      if(img) {
        const cloudinaryResponse = await CloudinaryService.v2.uploader.upload(img.tmpPath, {folder: 'forum/uploads'});
        post.img_path = cloudinaryResponse.secure_url
      }
      post.title = title
      post.text = text
      post.user_id = auth.user.id
      await post.save()
      session.flash({success: 'Sucessfully created a post'})
    } catch(e) {
      session.flash({error: e.message})
    }
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
  async show ({ params, request, response, view }) {
    const {id} = params
    const post = await Post.query().where('id', id).with('user').first()
    post.comments = (await Comment.query().where('post_id', post.id).with('user').fetch()).toJSON()
    return view.render('post', {post: post.toJSON(), meta: request.meta})
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
   async search ({ params, request, response, view }) {
    const {tag, title, time, user} = request.all()
    var queryToDisplay = ""; 
    var query = Post.query();
    if(tag) {
      query = query.whereHas('tags', (builder) => {
        builder.where('value', tag)
      })
      queryToDisplay += `tag: ${tag}`
    }
    if(title) {
      query = query.where('title', 'like', `%${title}%`)
      if(queryToDisplay)
        queryToDisplay += `, `
      queryToDisplay += `title: ${title}`
    }
    if(time) {
      query = query.where(`datediff(day, created_at, ${time})`, 0)
      if(queryToDisplay)
        queryToDisplay += `, `
      queryToDisplay += `time: ${time}`
    }
    if(user) {
      query = query.where(`user_id`, user)
      if(queryToDisplay)
        queryToDisplay += `, `
      queryToDisplay += `user: ${(await User.find(user)).username}`
    }
    const posts = await query.with('user').with('likes').with('comments').fetch()
    return view.render('search', {
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
  async edit ({ params, request, response, view }) {
    const {id} = params
    const post = await Post.find(id)
    return view.render('post_edit', {post: post.toJSON()})
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, session }) {
    const {id} = params
    const {title, text} = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const post = await Post.find(id)
    try{
      if(title) post.title = title
      if(text) post.text = text
      if(img) {
        await img.move(Helpers.tmpPath('uploads'), {
          name: `${new Date().getTime()}.${file.subtype}`
        })
        if (!img.moved()) {
          throw new RuntimeException
        }
        post.img_path = img.fileName
      }
    } catch(e) {
      session.flash({error: 'Error updating the post'})
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
  async destroy ({ params, request, response }) {
    const {id} = params;
    const post = await Post.find(id)
    await post.delete()
    return response.redirect('back')
  }
}

module.exports = PostController