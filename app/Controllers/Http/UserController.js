'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

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
  async enter ({ request, response, view }) {
    return view.render('enter');
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
    const {email, password} = request.all();
    if(!email || !password){
      session.flash({error: 'Please provide email and password'})
      return response.redirect('back')
    }
    try{
      await auth.attempt(email, password);
    } catch(err) {
      session.flash({error: err})
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
    return view.render('registration');
  }

  /**
   * Register/save a new user.
   * POST register
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session }) {
    const {email, password, confirmpassword} = request.all();

    if(!email || !password || !confirmpassword){
      session.flash({error: 'Please fill all the fields'});
      return response.redirect('back');
    }

    if (password !== confirmpassword){
      session.flash({error: "Passwords are not equal"});
      return response.redirect('back');
    }

    if(User.findBy({email: email})){
      session.flash({error: "There is such user"});
      return response.redirect('back');
    }

    var user = new User();
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
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Logoff the user.
   * GET exit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async exit ({ auth, response }) {
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
