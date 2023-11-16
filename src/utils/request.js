import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method == 'get') {
      config.params = config.data
    }
    const timestamp = Date.parse(new Date()) / 1000
    if (config.url.indexOf('?') > -1) {
      config.url += `&n=${timestamp}`
    } else {
      config.url += `?n=${timestamp}`
    }
    return config
  },
  error => {
    // do something with request error
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || '请求出错，请重试',
        type: 'error',
        duration: 1500,
        onClose: () => {
          if (res.code === 600 || res.code === 601) {
            // to re-login
            store.dispatch('user/resetToken').then(() => {
              if (window.location.pathname.indexOf('login') > -1) return
              setTimeout(() => { location.reload() }, 100)
            })
          }
        }
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    Message({
      message: '请求出错，请重试',
      type: 'error',
      duration: 1500
    })
    return Promise.reject(error)
  }
)

export default service
