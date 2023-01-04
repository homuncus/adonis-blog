class LocaleController {
  locale({ antl, response, params }) {
    const { lang } = params
    const locales = antl.availableLocales()
    if (locales.indexOf(lang) > -1) {
      response.cookie('lang', lang, { path: '/' })
    }
    return response.redirect('back')
  }
}

module.exports = LocaleController
