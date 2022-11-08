'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Logger = use('Logger')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { response, session, view }) {
    // if(error.status === 403){
    //   session.flash({error: 'You must be authenticated to perform that action'})
    //   return response.status(403).redirect('/login')
    // }
    // if(error.status === 500){
    //   return response.status(500).send(
    //     view.render('error', {
    //       status: 500,
    //       message: 'Server error, please try again'
    //     }))
    // }
    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    if(error.status >= 500)
      Logger.error(error, error);
  }
}

module.exports = ExceptionHandler
