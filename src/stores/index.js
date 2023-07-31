import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia
//配置统一导出优化代码
// import { useUserStore } from './modules/user'
// export { useUserStore }
//简便写法
export * from './modules/user' //意思是吧user里面的所有按需导出导入然后再导出
