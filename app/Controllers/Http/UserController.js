const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Role = use('App/Models/Role')

const cloudinary = use('App/Services/CloudinaryService')
const Hash = use('Hash')
const Env = use('Env')
const Mail = use('Mail')
const Access = use('Config').get('permission')
const DataTable = use('App/Services/DataTable')

const NotFoundException = use('App/Exceptions/NotFoundException')
const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')
const BadRequestException = use('App/Exceptions/BadRequestException')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  async index({ view }) {
    const roles = await Role.all()
    return view.render('admin.data.users', { roles: roles.toJSON() })
  }

  async data({ request, response }) {
    const data = request.get();

    const query = User
      .query()
      .select([
        'users.id',
        'users.username',
        'users.email',
        'roles.name',
        'users.created_at'
      ])
      .leftJoin('roles', 'roles.id', 'users.role_id')

    const datatable = new DataTable(query, ['users.username', 'users.email', 'roles.name'], data);
    const datatableResponse = await datatable.result();
    return datatableResponse;
  }

  async ajaxShow({ params, response }) {
    const { id } = params
    const user = await User.query()
      .with('role')
      .where('id', id)
      .first()
    return user.toJSON()
  }

  async create({ request, response, session }) {
    const {
      username, email, roleId, password, confirmPassword
    } = request.all()
    if (password !== confirmPassword) {
      session.flash({ error: 'Passwords are not equal!' })
      return response.redirect('back')
    }
    try {
      await User.create({
        username,
        email,
        role_id: roleId,
        password,
      })
    } catch (e) {
      session.flash({ error: e.message })
    }
    return response.redirect('back')
  }

  async show({ params, view, auth }) {
    const { id } = params

    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    await user.load('comments')
    user.posts = (await user
      .posts()
      .orderBy('created_at')
      .limit(4)
      .with('user')
      .with('comments')
      .with('likes')
      .fetch()).toJSON()
    return view.render(`profile/${auth.user.id === parseInt(id, 10)
      ? 'private' : 'public'}`, { user: user.toJSON() })
  }

  async update({
    params, request, response, session
  }) {
    const { id } = params
    const { name, roleId } = request.post()
    await User.query()
      .where('id', id)
      .update({
        username: name,
        role_id: roleId
      })
    session.flash({ success: 'Updated the user' })
    return response.redirect('back')
  }

  async enter({
    request, response, view, auth
  }) {
    await auth.logout()
    return view.render('auth/login')
  }

  async login({
    auth, request, response, session
  }) {
    const { email, password, remember } = request.all()
    if (!email || !password) {
      session.flash({ error: 'Please provide email <strong>and</strong> password' }).flashExcept(['password'])
      return response.redirect('back')
    }
    try {
      await auth.remember(!!remember).attempt(email, password)
    } catch (err) {
      session.flash({ error: err.message }).flashExcept(['password'])
      return response.redirect('back')
    }
    return response.redirect('/')
  }

  async registration({ view, auth }) {
    await auth.logout()
    return view.render('auth.signup')
  }

  async signup({
    request, response, session, auth
  }) {
    const {
      username, email, password, confirmpassword, subscribed
    } = request.all()

    if (!username || !email || !password || !confirmpassword) {
      session.flash({ error: 'Please fill all the fields' })
      return response.redirect('back')
    }

    if (password !== confirmpassword) {
      session.flash({ error: 'Passwords are not equal' })
      return response.redirect('back')
    }

    if (await User.findBy('email', email) || await User.findBy('username', username)) {
      session.flash({ error: 'There is user with such email or username' })
      return response.redirect('back')
    }
    await User.create({
      username,
      email,
      password,
      subscribed: !!subscribed
    })
    session.flash({ success: 'Registration successful' })
    await auth.attempt(email, password)
    // await Mail   //comment in case of accidental email sending
    //   .send('emails.registered', user, message => {
    //     message.from(Env.get('MAIL_USERNAME'))
    //       .to(user.email)
    //       .subject('Welcome to the Forum!')
    //   })

    return response.redirect('/')
  }

  async restore({ request, response, session }) {
    const { email } = request.all()
    if (!email) throw new BadRequestException()
    const user = await User.findBy('email', email)
    if (!user) {
      session.flash({ error: 'There is no such user' })
      return response.redirect('back')
    }
    await Mail.send(
      'emails.password_restore',
      { id: user.id },
      (message) => {
        message.from(Env.get('MAIL_USERNAME'))
          .to(email)
          .subject('Password reset')
      }
    )
    session.flash({ success: `Password reset link was sent to ${email}` })
    return response.redirect('back')
  }

  async reset({ params, view }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) return new NotFoundException()
    return view.render('auth.reset', { id: user.id })
  }

  // async update({ params, request, response, session }) {
  //   const {id} = params
  //   const { password, confirmpassword } = request.all()
  //   const user = await User.find(id)
  //   if(!user) throw new NotFoundException()
  //   if(password !== confirmpassword) {
  //     session.flash({error: 'Passwords are not equal'})
  //     return response.redirect('back')
  //   }
  //   user.password = password
  //   await user.save()
  //   session.flash({success: 'Password was successfully changed'})
  //   return response.route('UserController.enter')
  // }

  async edit({
    params, response, view, auth, session
  }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (auth.user.id === parseInt(id, 10)) {
      return view.render('profile.edit', { user: user.toJSON() })
    }
    throw new NotAuthorizedException()
  }

  async updatePrivate({
    params, request, response, session, auth
  }) {
    const { id } = params
    if (parseInt(id, 10) !== auth.user.id) {
      throw new NotAuthorizedException()
    }
    const { oldpassword, newpassword, newpasswordconfirm } = request.all()
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (auth.user.id !== user.id) { throw new NotAuthorizedException() }
    if (!await Hash.verify(oldpassword, user.password)) {
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

  async updateGeneral({
    params, request, response, session, auth
  }) {
    const { id } = params
    if (parseInt(id, 10) !== auth.user.id) {
      throw new NotAuthorizedException()
    }
    const {
      username, email, description, subscribed
    } = request.all()
    const avatar = request.file('avatar', {
      types: ['image'],
      size: '512kb',
      extnames: ['png', 'jpg', 'jpeg']
    })
    const user = await User.find(id)

    if (!user) throw new NotFoundException()
    if (auth.user.id !== user.id /* && !await auth.user.can(Access.REDACT_USERS) */) {
      throw new NotAuthorizedException()
    }

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
        const imgFilename = user.avatar_url.split('/').at(-1)
        const imgId = `forum/avatars/${imgFilename.slice(0, imgFilename.indexOf('.'))}`
        await cloudinary.v2.uploader.destroy(imgId, { invalidate: true, resource_type: 'image' })
      }
      const cloudinaryResponse = await cloudinary.v2
        .uploader
        .upload(avatar.tmpPath, {
          folder: 'forum/avatars',
          width: 512,
          height: 512,
          crop: 'fill'
        })
      user.avatar_url = cloudinaryResponse.secure_url
      await user.save()
      session.flash({ success: 'successfully changed the avatar' })
    }
    return response.redirect('back')
  }

  async logout({ auth, response }) {
    await auth.logout()
    return response.redirect('/login')
  }

  async destroy({
    params, request, response, session, auth
  }) {
    const { id } = params
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    if (auth.user.id !== user.id /* && !await auth.user.can(Access.DELETE_USERS) */) {
      throw new NotAuthorizedException()
    }
    if (user.avatar_url !== Env.get('GUEST_AVATAR_URL')) { // deleting user`s avatar image
      const imgFilename = user.avatar_url.split('/').at(-1)
      const imgId = `forum/avatars/${imgFilename.slice(0, imgFilename.indexOf('.'))}`
      await cloudinary.v2.uploader.destroy(imgId, { invalidate: true, resource_type: 'image' })
    }
    if (auth.user.id === user.id) await auth.logout()
    await user.delete()
    session.flash({ success: 'The account has been successfully deleted' })
    return response.redirect('/login')
  }

  async delete({ params, session, response }) {
    const { id } = params
    await User.query()
      .where('id', id)
      .delete()
    session.flash({ success: 'Deleted user' })
    return response.redirect('back')
  }
}

module.exports = UserController
