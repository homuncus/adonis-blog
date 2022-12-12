/**
 * Module with all app permissions available
 * 
 * To add a new permission, simply add a new attribute 
 * and then add middleware on corresponding route in
 * `routes.js`
 */
module.exports = {
    DELETE_POSTS: 'delete posts',
    REDACT_POSTS: 'redact posts',
    CREATE_USERS: 'create users',
    DELETE_USERS: 'delete users',
    CHANGE_USER_ROLE: 'change user role',
    MAIL_USERS: 'mail users',
    REDACT_COMMENTS: 'redact comments',
    DELETE_COMMENTS: 'delete comments'
}
