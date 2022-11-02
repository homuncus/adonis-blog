'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class CodeException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, {response, session}) {
    session.flash({error: 'server error, please try again later'})
    return response.status(500).redirect('back')
  }

  report(error){
    console.log(error.message);
  }
}

module.exports = CodeException
