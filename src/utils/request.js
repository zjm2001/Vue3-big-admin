import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-plus'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    //判断返回是否正确正确继续返回
    if (res.data.code === 0) {
      return res //可以res.data吧外层去除
    }
    // 返回数据错误抛出异常终止 获取错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    //错误的特殊处理 401 或者是权限不足 或者是token过期==>拦截到login界面
    if (err.response?.status === 401) {
      router.push('/login')
    }
    //错误的默认情况提示
    ElMessage.error(err.response.data.message || '服务异常')
    console.log(err)
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
