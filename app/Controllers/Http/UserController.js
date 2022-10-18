'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')

const cloudinary = use('App/Services/CloudinaryService');
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
    return view.render('login');
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
    return view.render('signup');
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
    const user = User.find(id)
    if(auth.user.id === id)
      return view.render('user_edit', {user: user.toJSON()})
    else {
      session.flash({error: 'You cannot edit someone else`s profile'})
      return response.redirect('back')
    }

  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, session }) {
    const {id} = params
    const {username, oldpassword, newpassword} = request.all()
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '512kb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const user = await User.find(id)
    if(username || newpassword) {
      if(!oldpassword){
        session.flash({error: 'old password required'})
        return response.redirect('back')
      }
      if(username && oldpassword === user.password) {
        user.username = username
        await user.save()
        session.flash({success: 'successfully changed the username'})
      }
      if(newpassword && oldpassword == user.password) {
        user.password = newpassword
        await user.save()
        session.flash({success: 'successfully changed the password'})
      }
    }
    if(avatar) {
      if(user.avatar_url !== Env.get('GUEST_AVATAR_URL'))
        await cloudinary.v2.uploader.destroy(user.avatar_url)
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(avatar.tmpPath, {folder: 'forum/avatars'});
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
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
