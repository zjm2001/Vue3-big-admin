<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article.js'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({ ...defaultForm })

const imgUrl = ref('') //图片上传地址
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //预览上传图片
  formModel.value.cover_img = uploadFile.raw
}
//发布文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // console.log('编辑操作')
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add') //通知父组件添加成功
  }
}
const visibleDrawer = ref(false) //抽屉的显示与隐藏
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // console.log('编辑回显')
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
  } else {
    // console.log('添加功能')
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
defineExpose({
  open
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onUploadFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html">
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
