'use strict'

const { RuntimeException } = require('@adonisjs/lucid/src/Exceptions')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')
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
    const posts = await Post.all()
    view.render('index', {posts: posts})
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
    view.render('addpost');
  }

  /**
   * Create/save a new post.
   * POST posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session }) {
    const {theme, text} = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })

    try{
      await img.move(Helpers.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${file.subtype}`
      })
      if (!img.moved()) {
        throw new RuntimeException
      }
      const post = new Post()
      post.theme = theme
      post.text = text
      post.img_path = img.fileName
      await post.save()
      session.flash({success: 'Sucessfully created a post'})
    } catch(e) {
      session.flash({error: 'Error creating a post'})
    }
    response.redirect('back');
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
    const post = await Post.find(id)
    return view.render('post-show', {post: post})
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
    return view.render('post-edit', {post: post})
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
    const {theme, text} = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const post = await Post.find(id)
    try{
      if(theme) post.theme = theme
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
    response.redirect('back')
  }
}

module.exports = PostController