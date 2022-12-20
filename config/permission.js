/**
 * Module with all app permissions available
 * 
 * To add a new permission, simply add a new attribute 
 * and then add middleware on corresponding route in
 * `routes.js`
 */
module.exports = {
    DELETE_POSTS: 1,
    REDACT_POSTS: 2,
    CREATE_USERS: 3,
    DELETE_USERS: 4,
    CHANGE_USER_ROLE: 5,
    MAIL_USERS: 6,
    REDACT_COMMENTS: 7,
    DELETE_COMMENTS: 8,
}
