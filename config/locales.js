const obj = {
  UKRAINIAN: 'ua',
  ENGLISH: 'en',
  GERMAN: 'de'
}

const arr = []
// eslint-disable-next-line guard-for-in
for (const locale in obj) {
  arr.push(obj[locale]);
}

module.exports = { obj, arr }
