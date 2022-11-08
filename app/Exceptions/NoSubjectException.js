'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NoSubjectException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response, session }) {
    session.flash({ error: 'No or invalid search subject provided, redirecting to post search' })
    return response.status(400).route('AdminController.search', {subject: 'posts'})
  }
}

module.exports = NoSubjectException
