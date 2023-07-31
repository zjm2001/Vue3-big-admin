<script setup>
import { useUserStore } from '@/stores'
const UserStore = useUserStore()
</script>
<template>
  <h1>我是app入口组件</h1>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning" @click="UserStore.setToken('')">退出登录</el-button>
    <el-button type="danger" @click="UserStore.setToken('ajgfjsgjfgajgfjsagfjsa')">点击得到token</el-button>
  </el-row>
  <p>{{ UserStore.token }}</p>
</template>
<style scoped></style>
