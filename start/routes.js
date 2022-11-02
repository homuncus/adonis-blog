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

Route.get('/', 'PostController.index')
Route.get('search', 'PostController.search').prefix('posts')

Route.group(() => {
  Route.get('login', 'UserController.enter')
  Route.post('login', 'UserController.login')
  Route.get('signup', 'UserController.registration')
  Route.post('signup', 'UserController.signup')
  Route.get('logout', 'UserController.logout')
}).middleware('guest')

// Route.group(()=>{

Route.group('posts', () => {
  Route.get(':id', 'PostController.show')
  Route.post(':id/like', 'PostLikeController.like')
  Route.post(':id/unlike', 'PostLikeController.dislike')
})
  .prefix('posts')
  .middleware('auth')

Route.group('comments', () => {
  Route.post(':id/like', 'CommentLikeController.like')
  Route.post(':id/unlike', 'CommentLikeController.dislike')
  Route.post('create', 'CommentController.store')
  Route.post(':id/delete', 'CommentController.destroy')
})
  .prefix('comments')
  .middleware('auth')

Route.group('users', () => {
  Route.get(':id', 'UserController.show')
  Route.get(':id/edit', 'UserController.edit')
  Route.post(':id/edit.general', 'UserController.updateGeneral')
  Route.post(':id/edit.private', 'UserController.updatePrivate')
  Route.post(':id/destroy', 'UserController.destroy')
})
  .prefix('users')
  .middleware('auth')

Route.group('admin', () => {
  Route.get('/', 'AdminController.index')
  Route.get('posts/create', 'PostController.create')
  Route.post('posts/create', 'PostController.store')
})
  .prefix('admin')
  .middleware(['auth', 'admin'])

// }).middleware('auth')
