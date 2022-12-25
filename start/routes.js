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
const Access = use('Access')

Route.get('/', 'PostController.index').middleware('meta')
Route.get('search', 'PostController.search').middleware('meta')

Route.group(() => {
  Route.get('login', 'UserController.enter')
  Route.post('login', 'UserController.login')
    .validator('User/Login')
  Route.get('signup', 'UserController.registration')
  Route.post('signup', 'UserController.signup')
    .validator('User/Store')
  Route.post('restore', 'UserController.restore')
  Route.get('reset/:id', 'UserController.reset')
  Route.patch('reset/:id', 'UserController.update')
}).middleware('guest')
Route.get('logout', 'UserController.logout')
// Route.group(()=>{
Route.group('posts', () => {
  Route.get('create', 'PostController.create')
  Route.post('create', 'PostController.store')
    .validator('Post/Store')
  Route.get(':id', 'PostController.show').middleware('meta')
  Route.get(':id/edit', 'PostController.edit')
  Route.patch(':id', 'PostController.update')
    .validator('Post/Store')
  Route.delete(':id', 'PostController.destroy')
  Route.post(':id/like', 'PostLikeController.like')
  Route.post(':id/unlike', 'PostLikeController.dislike')
})
  .prefix('posts')
  .middleware('auth')

Route.group('comments', () => {
  Route.post('create', 'CommentController.store')
    .validator('Comment/Store')
  Route.post(':id/like', 'CommentLikeController.like')
  Route.post(':id/unlike', 'CommentLikeController.dislike')
  Route.delete(':id', 'CommentController.destroy')
})
  .prefix('comments')
  .middleware('auth')

Route.group('users', () => {
  Route.post('/', 'UserController.signup').validator('User/Store')
  Route.get(':id', 'UserController.show')
  Route.get(':id/edit', 'UserController.edit')
  Route.patch(':id/general', 'UserController.updateGeneral').validator('User/UpdateGeneral')
  Route.patch(':id/private', 'UserController.updatePrivate').validator('User/UpdatePrivate')
  Route.delete(':id', 'UserController.destroy')
})
  .prefix('users')
  .middleware('auth')

Route.group('roles_admin', () => {
  Route.get('/', 'RoleController.index')
  Route.get('data', 'RoleController.data')
  Route.get(':id', 'RoleController.show')
  Route.post('/', 'RoleController.create')
    .middleware(`access:${Access.CREATE_ROLES}`)
    .validator('Role/Store')
  Route.patch(':id', 'RoleController.update')
    .middleware(`access:${Access.REDACT_ROLES}`)
    .validator('Role/Update')
  Route.delete(':id', 'RoleController.destroy').middleware(`access:${Access.DELETE_ROLES}`)
})
  .prefix('admin/roles')
  .middleware(['auth', 'access'])

Route.group('users_admin', () => {
  Route.get('/', 'UserController.index')
  Route.get('data', 'UserController.data')
  Route.get(':id', 'UserController.ajaxShow')
  Route.post('/', 'UserController.create')
    .middleware(`access:${Access.CREATE_USERS}`)
    .validator('User/Store')
  Route.patch(':id', 'UserController.update')
    .middleware(`access:${Access.REDACT_USERS}`)
    .validator('User/UpdateAdmin')
  Route.delete(':id', 'Usercontroller.delete').middleware(`access:${Access.DELETE_USERS}`)
})
  .prefix('admin/users')
  .middleware(['auth', 'access'])

Route.group('posts_admin', () => {
  Route.get('/', 'PostController.ajaxIndex')
  Route.get('data', 'PostController.data')
  Route.get(':id', 'PostController.ajaxShow')
  Route.post('/', 'PostController.store').validator('Post/Store')
  Route.patch(':id', 'PostController.update').validator('Post/Store')
  Route.delete(':id', 'PostController.destroy')
})
  .prefix('admin/posts')
  .middleware(['auth', 'access'])

Route.group('admin', () => {
  Route.get('/', 'AdminController.index')
  Route.patch('users/:id', 'AdminController.updateUser').middleware(`access:${Access.REDACT_USERS}`)
  Route.post('users/:id/email', 'AdminController.email')
    .middleware(`access:${Access.MAIL_USERS}`)
    .validator('Mail/One')
  Route.get('stats/download', 'AdminController.generatePdfStatistic')
  Route.get('mailing', 'AdminController.mailing').middleware(`access:${Access.MAIL_USERS}`)
  Route.post('mailing', 'AdminController.emailMany')
    .middleware(`access:${Access.MAIL_USERS}`)
    .validator('Mail/Many')
})
  .prefix('admin')
  .middleware(['auth', 'access'])

// Route.group('api', () => {
//   Route.get('users', 'ApiController.getUsers')
//   Route.get('posts', 'ApiController.getPosts')
//   Route.get('roles', 'ApiController.getRoles')
// })
//   .prefix('api')
//   .middleware(['auth', 'access'])

// }).middleware('auth')
