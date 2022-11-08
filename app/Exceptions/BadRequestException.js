'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class BadRequestException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response, view }) {
    return response.status(400).send(
      view.render('error', {
        status: 400,
        message: 'Bad request'
      })
    )
  }
}

module.exports = BadRequestException
