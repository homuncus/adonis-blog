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
Route.get('search', 'PostController.search').middleware('meta')

Route.group(() => {
  Route.get('login', 'UserController.enter')
  Route.post('login', 'UserController.login')
  Route.get('signup', 'UserController.registration')
  Route.post('signup', 'UserController.signup') 
  Route.post('restore', 'UserController.restore')
  Route.get('reset/:id', 'UserController.reset')
  Route.patch('reset/:id', 'UserController.update')
}).middleware('guest')
Route.get('logout', 'UserController.logout')
// Route.group(()=>{

Route.group('posts', () => {
  Route.get('create', 'PostController.create')
  Route.post('create', 'PostController.store')
  Route.get(':id', 'PostController.show').middleware('meta')
  Route.get(':id/edit', 'PostController.edit')
  Route.patch(':id', 'PostController.update')
  Route.delete(':id', 'PostController.destroy')
  Route.post(':id/like', 'PostLikeController.like')
  Route.post(':id/unlike', 'PostLikeController.dislike')
})
  .prefix('posts')
  .middleware('auth')

Route.group('comments', () => {
  Route.post('create', 'CommentController.store')
  Route.post(':id/like', 'CommentLikeController.like')
  Route.post(':id/unlike', 'CommentLikeController.dislike')
  Route.delete(':id', 'CommentController.destroy')
})
  .prefix('comments')
  .middleware('auth')

Route.group('users', () => {
  Route.get(':id', 'UserController.show')
  Route.get(':id/edit', 'UserController.edit')
  Route.patch(':id/general', 'UserController.updateGeneral')
  Route.patch(':id/private', 'UserController.updatePrivate')
  Route.delete(':id', 'UserController.destroy')
})
  .prefix('users')
  .middleware('auth')

Route.group('admin', () => {
  Route.get('/', 'AdminController.index')
  Route.get('posts', 'AdminController.search')
  Route.get('users', 'AdminController.search')
  Route.get('users/:id', 'AdminController.showUser')
  Route.patch('users/:id', 'AdminController.updateUser')
  Route.post('users/:id/email', 'AdminController.email')
  Route.get('stats/download', 'AdminController.generatePdfStatistic')
})
  .prefix('admin')
  .middleware(['auth', 'admin'])

// }).middleware('auth')