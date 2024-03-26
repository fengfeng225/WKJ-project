module.exports = {
  imgUrl: process.env.VUE_APP_BASE_API + '/uploadFiles/images/',
  timeout: process.env.NODE_ENV === 'development' ? 50000 : 500000,
  version: '1.0'
}
