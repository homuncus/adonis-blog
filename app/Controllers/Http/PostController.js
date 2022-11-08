/** @type {typeof import('@adonisjs/../../app/Models/Post')} */
const Post = use('App/Models/Post')
/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/../../app/Models/Comment')} */
const Comment = use('App/Models/Comment')
const NotFoundException = use('App/Exceptions/NotFoundException')

const cloudinary = use('App/Services/CloudinaryService');
const Helpers = use('Helpers')
const Database = use('Database')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  async index({ request, response, view }) {
    const posts = await Post.query()
      .with('comments')
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

  async create({ view }) {
    return view.render('posts/add');
  }

  async store({ request, response, session, auth }) {
    const { title, text, tags } = request.all()
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
    post.tags = tags
    post.user_id = auth.user.id
    await post.save()
    session.flash({ success: 'Sucessfully created a post' })

    return response.redirect('/');
  }

  async show({ params, view, request, auth }) {
    const { id } = params
    const post = await Post
      .query()
      .where('id', id)
      .with('user')
      .with('likes')
      .with('comments.user')
      .with('comments.likes')
      .first()
    if(!post) throw new NotFoundException()
    post.is_liked = post.getRelated('likes').rows.filter(like => 
      like.user_id === auth.user.id
    ).length > 0
    post.getRelated('comments').rows.forEach(comment => {
      console.log(comment);
      comment.is_liked = comment.getRelated('likes').rows.filter(like =>
        like.user_id === auth.user.id
      ).length > 0
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
    let queryToDisplay = [];
    let query = Post.query();
    if (tag) {
      // query.raw(`SELECT * FROM posts CROSS APPLY OPENJSON(tags,'$.value') WHERE value = '${tag}'`)
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

  async edit({ params, request, response, view }) {
    const { id } = params
    const post = await Post.find(id)
    return view.render('posts/edit', { post: post.toJSON() })
  }

  async update({ params, request, response, session }) {
    const { id } = params
    const { title, text, tags } = request.all()
    const img = request.file('img', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const post = await Post.find(id)
    if(!post) throw new NotFoundException()
    if (title) post.title = title
    if (text) post.text = text
    if(tags) post.tags = tags
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
    session.flash({success: `Updated post ${post.title}`})
    return response.redirect('/')
  }

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
