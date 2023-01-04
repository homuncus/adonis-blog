class Locale {
  async handle({ request, subdomains, antl }, next) {
    const lang = request.cookie('lang')
    if (lang) {
      antl.switchLocale(lang)
    }
    await next()
  }
}

module.exports = Locale
