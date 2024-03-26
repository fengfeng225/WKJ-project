<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main">
      <div class="BL-common-page-header">
        <el-page-header :content="title" @back="goBack" />
      </div>

      <div class="main">
        <div v-if="hasUploadPermission">
          <el-upload
            ref="upload"
            class="upload"
            action="#"
            accept="image/*"
            list-type="picture"
            :http-request="uploadPic"
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary" :disabled="!!imageUrl">选择图片</el-button>
            <el-button v-if="imageUrl" size="small" type="danger" :loading="removeBtnLoading" @click.stop="removeImage">删除图片</el-button>
            <el-button v-if="!imageUrl && hasUploadFile" style="margin-left: 10px;" size="small" type="success" :loading="btnLoading" @click.stop="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式的图片，且不超过2Mb</div>
          </el-upload>
        </div>
        <div class="upload-pic">
          <template v-if="imageUrl">
            <el-image
              style="width: 100%; height: 100%"
              fit="contain"
              alt="流程图"
              :src="define.imgUrl + imageUrl"
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
import { uploadImage, removeImage } from '@/api/bill/mb/bill'
import define from '@/utils/define'

export default {
  props: {
    hasUploadPermission: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: '',
      title: '',
      type: '',
      btnLoading: false,
      removeBtnLoading: false,
      imageUrl: '',
      fileList: [],
      srcList: [],
      hasUploadFile: false,
      isRefresh: false
    }
  },

  methods: {
    init({ id, title, type, imageUrl }) {
      this.id = id
      this.title = title
      this.type = type
      if (imageUrl) {
        this.imageUrl = imageUrl
        this.srcList.push(define.imgUrl + imageUrl)
      }
    },

    goBack() {
      this.$emit('close', this.isRefresh)
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

    handleExceed() {
      this.$message.error('添加失败！只能选择一张图片！')
    },

    handleChange(file, fileList) {
      if (fileList.length > 0) this.hasUploadFile = true
    },

    handleRemove(file, fileList) {
      if (fileList.length === 0) this.hasUploadFile = false
    },

    submitUpload() {
      this.$refs.upload.submit()
      this.fileList = []
      this.hasUploadFile = false
    },

    uploadPic(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      this.btnLoading = true
      uploadImage(this.id, this.type, formData).then(res => {
        this.imageUrl = res.data.imageUrl
        this.srcList.push(define.imgUrl + this.imageUrl)
        this.isRefresh = true
        this.btnLoading = false
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },

    removeImage() {
      this.$confirm('您确定要删除该图片吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.removeBtnLoading = true
        removeImage(this.id, this.type).then(res => {
          this.imageUrl = ''
          this.srcList.splice(0)
          this.isRefresh = true
          this.removeBtnLoading = false
          this.$message({
            message: res.message,
            type: 'success',
            duration: 3000
          })
        }).catch(() => {
          this.removeBtnLoading = false
        })
      }).catch(() => {})
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
