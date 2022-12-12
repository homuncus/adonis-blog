'use strict'

const Post = use('App/Models/Post')
const User = use('App/Models/User')
const NoSubjectException = use('App/Exceptions/NoSubjectException')
const NotFoundException = use('App/Exceptions/NotFoundException')
const NotAuthorizedException = use('App/Exceptions/NotAuthorizedException')

const fs = require('fs')
const Mail = use('Mail')
const PDF = use('PDF')
const Env = use('Env')
const Helpers = use('Helpers')
const Access = use('Config').get('permission')
/**
 * Resourceful controller for interacting with admins
 */
class AdminController {

  async index({ request, response, view }) {

    return view.render('admin.index')
  }

  async search({ request, response, view, session }) {
    const { attr, query } = request.all()
    const subject = request.url().split('/').at(-1)
    var model;
    switch (subject) {
      // TODO: case 'topics':
      case 'posts':
        model = Post.query().with('user'); break
      case 'users':
        model = User.query().orderBy('role'); break
      default:
        throw new NoSubjectException()
    }
    const timeBefore = new Date()
    const items = query ?
      await model
        .where(attr, 'LIKE', `%${query}%`)
        .fetch()
      :
      await model.fetch()
    const timeAfter = new Date()

    return view.render(`admin.search.${subject}`, {
      items: items.toJSON(),
      executionTime: (timeAfter - timeBefore) / 1000
    })
  }

  async showUser({ params, view }) {
    const { id } = params
    const user = await User
      .query()
      .where('id', id)
      .with('posts.comments.user')
      .first()
    if (!user) throw new NotFoundException()
    return view.render('admin.profile', { user: user.toJSON() })
  }

  async updateUser({ params, request, response, auth }) {
    const { id } = params
    const { role } = request.all()
    if (!role) return response.redirect('back')
    const user = await User.find(id)
    if (!user) throw new NotFoundException()
    // if (!await auth.user.can(Access.CHANGE_USER_ROLE))
    //   throw new NotAuthorizedException()
    user.role = role
    await user.save()
    return response.redirect('back')
  }

  async email({ params, request, response, session, auth }) {

    // if (!await auth.user.can(Access.MAIL_USERS))
    //   throw new NotAuthorizedException()

    const { text } = request.all()
    const { id } = params
    const user = await User.find(id)
    if (!user) throw new NotFoundException()

    const time1 = new Date()
    await Mail
      .send('emails.admin_message', { text: text }, (message) => {
        message.to(user.email)
          .subject(`Message from the ${auth.user.role} of Volonteurs Forum`)
      })
    const time2 = new Date()
    session.flash({ success: `Sent the message to ${user.email} in ${(time2 - time1) / 1000} seconds` })
    return response.redirect('back')
  }

  async mailing({ view, auth }) {

    // if (!await auth.user.can(Access.MAIL_USERS))
    // throw new NotAuthorizedException()

    const users = await User
      .query()
      .where('id', '!=', auth.user.id)
      .orderBy('role')
      .fetch()
    const receievers = {
      admins: users.rows.filter(user => user.role === 'admin'),
      moderators: users.rows.filter(user => user.role === 'moderator'),
      users: users.rows.filter(user => user.role === 'user')
    }
    return view.render('admin.mailing', { data: receievers })
  }

  async emailMany({ request, response, session }) {

    // if (!await auth.user.can(Access.MAIL_USERS))
    //   throw new NotAuthorizedException()

    const { users, message } = request.all()
    const emails = typeof users === 'string' ? [users] : users  //check if it`s one user or multiple
    const time1 = new Date()
    await Mail
      .send('emails.admin_message', { text: message }, message => {
        emails.forEach(async email => {
          message.to(email)
        })
        message.subject('Mailing from the Forum')
      })
    const time2 = new Date()
    session.flash({ success: `Successfully emailed users in ${(time2 - time1) / 1000} seconds` })
    return response.redirect('back')
  }

  async generatePdfStatistic({ response, auth }) {
    const time1 = new Date()
    const content = [
      { text: 'Statistics', bold: true, fontSize: 24, alignment: 'center' },
      { text: `Number of users: ${await User.getCount()}` },
      { text: `Number of posts: ${await Post.getCount()}` },
      {
        text: `New users for last month: ${await User
          .query()
          .where('created_at', '<', new Date())
          .getCount()}`
      },
      {
        text: `New posts for last month: ${await Post
          .query()
          .where('created_at', '<', new Date())
          .getCount()}`
      },
    ]
    const fileName = Helpers.tmpPath(`pdf/${new Date().getTime()}_${auth.user.username}.pdf`)
    const stream = fs.createWriteStream(fileName);
    /*await*/ PDF.create(content, stream)
    const time2 = new Date()
    await new Promise(resolve => {  //manually wait for ~10ms, because pdf-adonis was poorly implemented
      setTimeout(resolve, time2 - time1 + 10)
    })
    return response.download(fileName)
  }
}

module.exports = AdminController
