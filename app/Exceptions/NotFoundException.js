'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, {response, session}) {
    session.flash({error: 'could`nt find such resource'})
    return response.redirect('back')
  }
}

module.exports = NotFoundException
