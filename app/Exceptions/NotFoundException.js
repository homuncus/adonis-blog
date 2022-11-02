'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, {response, session}) {
    session.flash({error: 'Unable to find such resource'})
    return response.status(404).redirect('back')
  }
}

module.exports = NotFoundException
