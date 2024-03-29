'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response, view }) {
    return response.status(404).send(
      view.render('error', {
        status: 404,
        message: 'Resource not found'
      }))
  }
}

module.exports = NotFoundException
