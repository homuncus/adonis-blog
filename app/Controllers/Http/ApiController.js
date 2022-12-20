'use strict'

/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/../../app/Models/User')} */
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Role = use('App/Models/Role')
const Database = use('Database')
const DataTableData = use('App/Services/DataTableData')

/**
 * Resourceful controller for interacting with apis
 */
class ApiController {

  async getUsers({ request, response }) {
    const { draw, start, length,
      search, order, columns } = request.get()
    const users = await User
      .query()
      .innerJoin('roles', 'roles.id', 'users.role_id')
      .select(columns.map(col => col.name))
      .whereRaw(`LOWER(users::text) LIKE LOWER('%${search.value}%') 
      OR LOWER(roles::text) LIKE LOWER('%${search.value}%')`)
      .orderBy(`${columns[order[0].column].name}`, `${order[0].dir}`)
      .paginate(start + 1, length)
    const data = new DataTableData(draw, users)
    return response.json(data)
  }

  async getPosts({ request, response }) { //todo
    const { draw, start, length,
      search, order, columns } = request.get()
    const posts = await Post
      .query()
      .select(columns.map(col => col.name))
      .innerJoin('users', 'posts.user_id', 'users.id')
      .whereRaw(`LOWER(posts::text) LIKE LOWER('%${search.value}%') 
      OR LOWER(users.username) LIKE LOWER('%${search.value}%')`)
      .groupByRaw('posts.id, users.id')
      .orderBy(`${columns[order[0].column].name}`, `${order[0].dir}`)
      .paginate(start + 1, length)
    const data = new DataTableData(draw, posts)
    return response.json(data)
  }

  async getPost({ request, response }) { 
    const { id } = request.get()
    const post = await Post.find(id)
    return response.json(post)
  }

  async getRoles({ request, response }) {
    const { draw, start, length,
      search, order, columns } = request.get()
    const roles = await Role
      .query()
      .select(columns.map(col => `${col.name} AS ${col.data}`))
      .innerJoin('permission_role', 'roles.id', 'permission_role.role_id')
      .whereRaw(`LOWER(roles.name) LIKE LOWER('%${search.value}%')`)
      .groupByRaw('roles.id')
      .orderBy(`${columns[order[0].column].name}`, `${order[0].dir}`)
      .paginate(start + 1, length)
    const data = new DataTableData(draw, roles)
    return response.json(data)
  }

}

module.exports = ApiController
