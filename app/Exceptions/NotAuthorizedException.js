'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotAuthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, {response, session}) {
    session.flash({error: 'you must be logged in to perform this operation'})
    return response.status(401).redirect('/login')
  }
}

module.exports = NotAuthorizedException
