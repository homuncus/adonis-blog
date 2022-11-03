'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('@adonisjs/../../app/Models/Post')} */
const Post = use('App/Models/Post')

const cloudinary = use('App/Services/CloudinaryService');
const Hash = use('Hash')
const Env = use('Env')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index ({ request, response, view }) {
  }

  /**
   * Show one user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async show ({ params, request, response, view, auth }) {
    const {id} = params
    const user = await User.find(id)
    await user.load('comments')
    user.posts = (await user.posts().orderBy('created_at').limit(4).with('user').with('comments').with('likes').with('tags').fetch()).toJSON()
    if(id == auth.user.id)
      return view.render('profile/private', {user: user.toJSON()})
    else
      return view.render('profile/public', {user: user.toJSON()})
  }

  /**
   * Render a form to be used for entering user info
   * GET enter
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async enter ({ request, response, view, auth }) {
    await auth.logout()
    return view.render('auth/login');
  }

  /**
   * Check if user exists and authorize.
   * POST enter
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login ({ auth, request, response, session }) {
    const {email, password, remember} = request.all();
    if(!email || !password){
      session.flash({error: 'Please provide email <strong>and</strong> password'})
      return response.redirect('back')
    }
    try{
      await auth.remember(remember ? true : false).attempt(email, password);
    } catch(err) {
      session.flash({error: err.message})
      return response.redirect('back')
    }
    return response.redirect('/');
  }

  /**
   * Render a form to be used for registering a new user.
   * GET register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async registration ({ view }) {
    return view.render('auth.signup');
  }

  /**
   * Register/save a new user.
   * POST register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async signup ({ request, response, session }) {
    const {username, email, password, confirmpassword} = request.all();

    if(!username || !email || !password || !confirmpassword){
      session.flash({error: 'Please fill all the fields'});
      return response.redirect('back');
    }

    if (password !== confirmpassword){
      session.flash({error: 'Passwords are not equal'});
      return response.redirect('back');
    }

    if(await User.findBy('email', email)){
      session.flash({error: 'There is such user'});
      return response.redirect('back');
    }

    var user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    await user.save();
    session.flash({success: 'Registration successful'})
    
    return response.redirect('/login');
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   * 
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, response, view, auth, session }) {
    const {id} = params
    const user = await User.find(id)
    if(auth.user.id == id)
      return view.render('profile.edit', {user: user.toJSON()})
    else {
      session.flash({error: 'You cannot edit someone else`s profile'})
      return response.redirect('back')
    }

  }

  /**
   * Update user details. (password)
   * POST users/:id/edit.private
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async updatePrivate ({ params, request, response, session, auth }) {
    const {id} = params
    if(id != auth.user.id){
      session.flash({error: 'You cannot edit someone else`s profile'})
      return response.redirect('back')
    }
    const {oldpassword, newpassword, newpasswordconfirm} = request.all()
    const user = await User.find(id)
    if(await Hash.verify(oldpassword, user.password)){
      session.flash({error: 'Invalid user password'})
      return response.redirect('back')
    }
    if(newpassword !== newpasswordconfirm || !newpassword){
      session.flash({error: 'Passwords are not equal or empty'})
      return response.redirect('back')
    }
    user.password = newpassword
    await user.save()
    session.flash({success: 'Successfully changed the password'})
    
    return response.redirect('back')
  }

  /**
   * Update user details. (no password)
   * POST users/:id/edit.general
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async updateGeneral ({ params, request, response, session, auth }) {
    const {id} = params
    if(id != auth.user.id){
      session.flash({error: 'You cannot edit someone else`s profile'})
      return response.redirect('back')
    }
    const {username, email, description} = request.all()
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '512kb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const user = await User.find(id)
    if(username && username !== user.username){
      user.username = username
      await user.save()
      session.flash({success: 'Successfully updated the username'})
    }
    if(email && email !== user.email){
      user.email = email
      await user.save()
      session.flash({success: 'Successfully updated the email'})
    }
    if(description){
      user.description = description
      await user.save()
      session.flash({success: 'Successfully updated information about you'})
    }
    if(avatar) {
      if(user.avatar_url !== Env.get('GUEST_AVATAR_URL')){
        let img_filename = user.avatar_url.split('/').at(-1)
        let img_id =  'forum/avatars/' + img_filename.slice(0, img_filename.indexOf('.'))
        await cloudinary.v2.uploader.destroy(img_id, {invalidate: true, resource_type: 'image'})
      }
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(avatar.tmpPath, {folder: 'forum/avatars', width: 512, height: 512, crop: "fill"});
      user.avatar_url = cloudinaryResponse.secure_url
      await user.save()
      session.flash({success: 'successfully changed the avatar'})
    }
    return response.redirect('back')
  }

  /**
   * Logoff the user.
   * GET logout
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async logout ({ auth, response }) {
    await auth.logout();
    return response.redirect('/login');
  }
  
  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, session, auth }) {
    const {id} = params
    const user = await User.find(id)
    if(user.avatar_url !== Env.get('GUEST_AVATAR_URL')){
      let img_filename = user.avatar_url.split('/').at(-1)
      let img_id =  'forum/avatars/' + img_filename.slice(0, img_filename.indexOf('.'))
      await cloudinary.v2.uploader.destroy(img_id, {invalidate: true, resource_type: 'image'})
    }
    await auth.logout()
    await user.delete()
    session.flash({success: 'Your account has been successfully deleted'})
    return response.redirect('/login')
  }
}

module.exports = UserController
