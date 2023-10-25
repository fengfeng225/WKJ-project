const APIURl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5000' : process.env.VUE_APP_BASE

module.exports = {
  APIURl: APIURl + '/edge',
  timeout: 1000000,
  version: '1.0'
}
