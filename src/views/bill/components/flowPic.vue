<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main">
      <div class="BL-common-page-header">
        <el-page-header :content="title" @back="goBack" />
      </div>

      <div class="main">
        <div>
          <el-upload
            ref="upload"
            class="upload"
            action="#"
            :http-request="uploadPic"
            :auto-upload="false"
            :file-list="fileList"
            :show-file-list="false"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-change="handleChange"
          >
            <el-button size="small" type="primary" :disabled="!!imageUrl">选择图片</el-button>
            <el-button size="small" type="danger" :disabled="!imageUrl" @click.stop="clearPic">清除图片</el-button>
            <el-button style="margin-left: 10px;" size="small" :type="imageUrl ? 'success' : 'primary'" :loading="btnLoading" @click.stop="submitUpload">{{ imageUrl ? '上传到服务器' : '保存' }}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式的图片，且不超过500kb</div>
          </el-upload>
        </div>
        <div class="upload-pic">
          <template v-if="imageUrl">
            <el-image
              style="width: 100%; height: 100%"
              fit="contain"
              alt="流程图"
              :src="imageUrl"
              :preview-src-list="srcList"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
          <template v-else>
            <el-empty description="暂无图片" />
          </template>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
import { uploadImage } from '@/api/bill/mb/bill'
export default {
  data() {
    return {
      id: '',
      title: '',
      btnLoading: false,
      imageUrl: '',
      fileList: [],
      srcList: []
    }
  },

  methods: {
    init(id, name) {
      this.id = id
      this.title = name
    },

    goBack() {
      this.$emit('close')
    },

    beforeUpload(file) {
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPic) {
        this.$message.error('只能上传JPG或PNG格式的图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isPic && isLt2M
    },

    handleChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.srcList.push(this.imageUrl)
    },

    submitUpload() {
      this.$refs.upload.submit()
      this.fileList = []
    },

    uploadPic(file) {
      console.log(file.file)
      const formData = new FormData()
      formData.append('file', file.file)
      uploadImage(this.id, formData).then(res => {
        console.log(res)
      }).catch(() => {})
    },

    clearPic() {
      this.imageUrl = ''
      this.fileList = []
      this.srcList = []
    },

    handleExceed() {
      this.$message.error('添加失败！只能选择一张图片！')
    },

    handleSuccess() {
      console.log(123)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
}
.upload-pic {
  margin-top: 10px;
  flex: 1;
  height: 0;
}
</style>
