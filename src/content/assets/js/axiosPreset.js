import axios from 'axios'
// import Vue from 'vue'
// import { Message } from 'element-ui'
// Vue.use(Message)
//  全局配置axios
const initAxios = () => {
  axios.defaults.baseURL = '//search-v2.hlgdata.com/'
  axios.defaults.withCredentials = true
  axios.defaults.crossDomain = true
  axios.defaults.timeout = 30000
  axios.defaults.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  axios.interceptors.response.use(
    res => {
      return res.data
    },
    error => {
      return Promise.reject(error)
    }
  )
}

export default initAxios
