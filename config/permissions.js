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
  REDACT_USERS: 5,
  MAIL_USERS: 6,
  REDACT_COMMENTS: 7,
  DELETE_COMMENTS: 8,
  CREATE_ROLES: 9,
  REDACT_ROLES: 10,
  DELETE_ROLES: 11
}
