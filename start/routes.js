'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PostController.index').middleware('meta')

Route.get('/login', 'UserController.enter')
Route.post('/login', 'UserController.login')
Route.get('/signup', 'UserController.registration')
Route.post('/signup', 'UserController.signup')
Route.get('/logout', 'UserController.logout')

Route.get('posts/create', 'PostController.create').middleware('auth_red')
Route.post('posts/create', 'PostController.store').middleware('auth_red')
Route.get('posts/:id', 'PostController.show').middleware('meta')
Route.get('search', 'PostController.search').middleware('meta')

Route.get('post_like/:id', 'PostLikeController.like').middleware('auth_red')
Route.get('post_unlike/:id', 'PostLikeController.dislike').middleware('auth_red')
Route.get('comment_like/:id', 'CommentLikeController.like').middleware('auth_red')
Route.get('comment_unlike/:id', 'CommentLikeController.dislike').middleware('auth_red')

Route.post('comments/create', 'CommentController.store').middleware('auth_red')
Route.post('comments/:id/delete', 'CommentController.destroy').middleware('auth_red')

Route.get('users/:id', 'UserController.show')
Route.get('users/:id/edit', 'UserController.edit').middleware('auth_red')
Route.post('users/:id/edit.general', 'UserController.updateGeneral').middleware('auth_red')
Route.post('users/:id/edit.private', 'UserController.updatePrivate').middleware('auth_red')
Route.post('users/:id/destroy', 'UserController.destroy')

Route.get('admin', 'AdminController.index').middleware(['auth', 'admin'])