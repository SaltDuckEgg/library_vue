<template>
  <div style="text-align: center">
    <!--视频流展示-->
    <video ref="video" width="640" height="480" autoplay />
    <div style="position:absolute; float: left; margin-left: 10px; margin-top: 10px; overflow: auto">
      <!--canvas截取流并展示照片-->
      <canvas ref="canvas" width="160" height="120" />
    </div>
    <div style="margin-top: 10px">
      <!--照相按钮-->
      <img :src="photoImg" width="64" height="64" alt="摄像头" @click="photograph">
    </div>
    <div style="margin-top: 10px">
      <!--确认-->
      <el-button type="primary" @click="upload">上传</el-button>
    </div>
  </div>
</template>

<script>
import {loginByFace, uploadUserImg} from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Face',
  props: { close: Boolean },
  data() {
    return {
      photoImg: require('@/assets/face_photo/photo.png'),
      userImgFile: undefined
    }
  },
  watch: {
    close: function(val) {
      if (val) {
        console.log('yes')
        this.closeCamera()
      } else {
        console.log('no')
        this.callCamera()
      }
    }
  },
  created() {
    this.callCamera()
  },
  methods: {
    // 调用摄像头
    callCamera() {
      console.log('callCamera!')
      // H5调用电脑摄像头API
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(success => {
        // 摄像头开启成功
        this.$refs['video'].srcObject = success
        // 实时拍照效果
        this.$refs['video'].play()
      }).catch(error => {
        console.log(error)
        console.error('摄像头开启失败，请检查摄像头是否可用！')
      })
    },
    // 拍照
    photograph() {
      const ctx = this.$refs['canvas'].getContext('2d')
      // 缩放图片大小，但不改变图片像素
      ctx.scale(0.25, 0.25)
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 640, 480)
      // 恢复缩放，避免下次照相时再次缩小
      ctx.scale(4, 4)
      // 图片转file
      new Promise(resolve => {
        this.$refs['canvas'].toBlob(function(blob) {
          console.log(blob)
          resolve(blob)
        })
      }).then((blob) => {
        this.userImgFile = new window.File([blob], this.$store.getters.username + '.jpg')
        console.log('ori_img', this.userImgFile)
      })
    },
    upload() {
      const formData = new FormData()
      // formData.append('ori_img', this.userImgFile)
      formData.append('login_img', this.userImgFile)
      // uploadUserImg(formData).then(res => {
      //   Message({
      //     message: '照片上传成功！',
      //     type: 'success',
      //     duration: 5 * 1000
      //   })
      // })
      loginByFace(formData).then(res => {
        console.log(res)
        Message({
          message: '照片上传成功！',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 关闭摄像头
    closeCamera() {
      if (!this.$refs['video'].srcObject) {
        this.dialogCamera = false
        return
      }
      const stream = this.$refs['video'].srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    }
  }
}

</script>

<style scoped>

</style>
