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
const Mail = use('Mail')

const NotFoundException = use('App/Exceptions/NotFoundException')
const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const BadRequestException = use('App/Exceptions/BadRequestException')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  async index({ request, response, view }) {
  }

  async show({ params, view, auth }) {
    const { id } = params
    const user = await User.find(id)
    await user.load('comments')
    user.posts = (await user
      .posts()
      .orderBy('created_at')
      .limit(4)
      .with('user')
      .with('comments')
      .with('likes')
      .fetch()).toJSON()
    if (id == auth.user.id)
      return view.render('profile/private', { user: user.toJSON() })
    return view.render('profile/public', { user: user.toJSON() })
  }

  async enter({ request, response, view, auth }) {
    await auth.logout()
    return view.render('auth/login');
  }

  async login({ auth, request, response, session }) {
    const { email, password, remember } = request.all();
    if (!email || !password) {
      session.flash({ error: 'Please provide email <strong>and</strong> password' })
      return response.redirect('back')
    }
    try {
      await auth.remember(!!remember).attempt(email, password);
    } catch (err) {
      session.flash({ error: err.message })
      return response.redirect('back')
    }
    return response.redirect('/');
  }

  async registration({ view, auth }) {
    await auth.logout()
    return view.render('auth.signup');
  }

  async signup({ request, response, session }) {
    const { username, email, password, confirmpassword } = request.all();

    if (!username || !email || !password || !confirmpassword) {
      session.flash({ error: 'Please fill all the fields' });
      return response.redirect('back');
    }

    if (password !== confirmpassword) {
      session.flash({ error: 'Passwords are not equal' });
      return response.redirect('back');
    }

    if (await User.findBy('email', email)) {
      session.flash({ error: 'There is such user' });
      return response.redirect('back');
    }
    const user = await User.create({
      username: username,
      email: email,
      password: password
    })
    session.flash({ success: 'Registration successful' })

    await Mail
      .send('emails.registered', user, message => {
        message.from(Env.get('MAIL_USERNAME'))
          .to(user.email)
          .subject('Welcome to the Forum!')
      })

    return response.redirect('/login');
  }

  async restore({ request, response, session }) {
    const { email } = request.all()
    if (!email) throw new BadRequestException()
    const user = await User.findBy('email', email)
    if (!user) {
      session.flash({ error: 'There is no such user' })
      return response.redirect('back')
    }
    await Mail.send('emails.password_restore', { id: user.id },
      message => {
        message.from(Env.get('MAIL_USERNAME'))
          .to(email)
          .subject('Password reset')
      })
    session.flash({ success: `Password reset link was sent to ${email}` })
    return response.redirect('back');
  }

  async reset({ params, view }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) return new NotFoundException()
    return view.render('auth.reset', {id: user.id})
  }

  async update({ params, request, response, session }) {
    const {id} = params
    const { password, confirmpassword } = request.all()
    const user = await User.find(id)
    if(!user) throw new NotFoundException()
    if(password !== confirmpassword) {
      session.flash({error: 'Passwords are not equal'})
      return response.redirect('back')
    }
    user.password = password
    await user.save()
    session.flash({success: 'Password was successfully changed'})
    return response.route('UserController.enter')
  }

  async edit({ params, response, view, auth, session }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (auth.user.id == id)
      return view.render('profile.edit', { user: user.toJSON() })
    throw new NotAuthorizedException()
  }

  async updatePrivate({ params, request, response, session, auth }) {
    const { id } = params
    if (id != auth.user.id) {
      throw new NotAuthorizedException()
    }
    const { oldpassword, newpassword, newpasswordconfirm } = request.all()
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (await Hash.verify(oldpassword, user.password)) {
      session.flash({ error: 'Invalid user password' })
      return response.redirect('back')
    }
    if (newpassword !== newpasswordconfirm || !newpassword) {
      session.flash({ error: 'Passwords are not equal or empty' })
      return response.redirect('back')
    }
    user.password = newpassword
    await user.save()
    session.flash({ success: 'Successfully changed the password' })

    return response.redirect('back')
  }

  async updateGeneral({ params, request, response, session, auth }) {
    const { id } = params
    if (id != auth.user.id) {
      throw new NotAuthorizedException()
    }
    const { username, email, description, subscribed } = request.all()
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '512kb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    user.subscribed = !!subscribed
    if (username && username !== user.username) {
      user.username = username
      await user.save()
      session.flash({ success: 'Successfully updated the username' })
    }
    if (email && email !== user.email) {
      user.email = email
      await user.save()
      session.flash({ success: 'Successfully updated the email' })
    }
    if (description) {
      user.description = description
      await user.save()
      session.flash({ success: 'Successfully updated information about you' })
    }
    if (avatar) {
      if (user.avatar_url !== Env.get('GUEST_AVATAR_URL')) {
        let img_filename = user.avatar_url.split('/').at(-1)
        let img_id = 'forum/avatars/' + img_filename.slice(0, img_filename.indexOf('.'))
        await cloudinary.v2.uploader.destroy(img_id, { invalidate: true, resource_type: 'image' })
      }
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(avatar.tmpPath, { folder: 'forum/avatars', width: 512, height: 512, crop: "fill" });
      user.avatar_url = cloudinaryResponse.secure_url
      await user.save()
      session.flash({ success: 'successfully changed the avatar' })
    }
    return response.redirect('back')
  }

  async logout({ auth, response }) {
    await auth.logout();
    return response.redirect('/login');
  }

  async destroy({ params, request, response, session, auth }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (user.role === 'admin') throw new NotAuthorizedException()
    if (user.avatar_url !== Env.get('GUEST_AVATAR_URL')) {  //deleting user`s avatar image
      let img_filename = user.avatar_url.split('/').at(-1)
      let img_id = 'forum/avatars/' + img_filename.slice(0, img_filename.indexOf('.'))
      await cloudinary.v2.uploader.destroy(img_id, { invalidate: true, resource_type: 'image' })
    }
    await auth.logout()
    await user.delete()
    session.flash({ success: 'Your account has been successfully deleted' })
    return response.redirect('/login')
  }
}

module.exports = UserController
