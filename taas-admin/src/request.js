import axios from 'axios'
import { message } from 'antd'

export const baseURL =  'https://api.harmay.cn/api/'
// export const baseURL =  process.env.NODE_ENV === 'development' ? 'www.haoqidian.vip' : 'https://api.haoqidian.vip/api/'
let params = {
  baseURL: baseURL,
  timeout: 100000,
  headers: {
  }
}

let instance = axios.create(params)

instance.interceptors.request.use(function (config) {
  const tokenItem = document.cookie.split(';').find(item => ~item.indexOf('token'))
  const token = tokenItem && tokenItem.slice(tokenItem.indexOf('=') + 1)
  token && (config.headers['Authorization'] = token)
  // console.log('config', config)
  config.url = config.url + '.json?admin=1'
  return config;
}, function (error) {
  message.error('Network Anomaly!')
  return Promise.reject(error);
})

instance.interceptors.response.use(function (response) {
  console.log('response', response)
  const data = response.data
  return data;
}, function (error) {
  const errorInfo = error.response.data
  if (errorInfo && errorInfo.em) {
    message.error(errorInfo.em)
  } else {
    message.error('服务器异常')
  }
  return Promise.reject(error);
})

export default instance
