import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('') // 定义 token
    const user = ref({})
    const setToken = (t) => (token.value = t) // 设置 token
    const getUser = async () => {
      const res = await userGetInfoService() //请求用户数据
      user.value = res.data.data
    }
    const setUser = (obj) => (user.value = obj)
    return { token, setToken, user, getUser, setUser }
  },
  { persist: true }
)
