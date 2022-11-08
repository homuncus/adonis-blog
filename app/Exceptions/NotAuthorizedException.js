'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotAuthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { auth, response, session }) {
    // session.flash({ error: 'You dont have rights to perform that action!' })
    return response.status(403).send('You dont have rights to perform that action!')
  }
}

module.exports = NotAuthorizedException
