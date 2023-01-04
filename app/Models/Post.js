/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class Post extends Model {
  static boot() {
    super.boot()
    this.addHook('afterFetch', (posts) => {
      posts.forEach((post) => {
        post.reading_time = Math.ceil(posts[0].text.split(' ').length / 225)
        const _diffDays = (new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24)
        if (_diffDays > 1) {
          post.pub_date = moment(post.created_at).format('MMM Do, YYYY')
        } else {
          post.pub_date = moment(post.created_at).fromNow()
        }
      })
    })
  }

  likes() {
    return this.hasMany('App/Models/PostLike')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  likeCount() {
    return this.hasMany('App/Models/PostLike').length
  }

  comments() {
    return this.hasMany('App/Models/Comment')
  }

  translations() {
    return this.hasMany('App/Models/PostTranslation')
  }

  // getters
  static get computed() {
    return ['creationDate']
  }

  getCreationDate({ created_at }) {
    return moment(created_at).format('Do MMM, YYYY')
  }
}

module.exports = Post
