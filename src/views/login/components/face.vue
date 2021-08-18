<template>
  <div style="text-align: center">
    <!--视频流展示-->
    <video ref="video" width="264" height="198" autoplay />
    <!--canvas截取流并展示照片-->
    <canvas ref="canvas" width="160" height="120" style="position:fixed;left:100%" />
  </div>
</template>

<script>
import { loginByFace } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'FaceLogin',
  data() {
    return {
      userImgFile: undefined,
      intv: 0,
      token: '',
      formData: undefined
    }
  },
  created() {
    this.callCamera()
  },
  mounted() {
    this.refresh()
  },
  beforeDestroy() {
    clearInterval(this.intv)
    this.closeCamera()
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      }
    }
  },
  methods: {
    // 调用摄像头
    callCamera() {
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
    async refresh() {
      this.intv = setInterval(() => this.loop(), 2000)
      this.loop()
    },
    async loop() {
      const formData = this.upload()
      console.log('formData:')
      console.log(formData)
      const query = await loginByFace(formData)
      this.token = query.token
      if (query.token) {
        this.$store.dispatch('user/loginViaToken', this.token)
          .then(() => {
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          })
          .catch(() => {
          })
      }
    },
    upload() {
      const ctx = this.$refs['canvas'].getContext('2d')
      // 缩放图片大小，但不改变图片像素
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 640, 480)
      // 图片转file
      return new Promise(resolve => {
        this.$refs['canvas'].toBlob(function(blob) {
          console.log(blob)
          resolve(blob)
        })
      }).then((blob) => {
        this.userImgFile = new window.File([blob], 'login.jpg')
        const formData = new FormData()
        formData.append('login_img', this.userImgFile)
        this.formData = formData
        console.log('ori_img', this.userImgFile)
        console.log('正在拍照上传')
        return formData
      })
    },
    // 关闭摄像头
    closeCamera() {
      if (!this.$refs['video'].srcObject) {
        this.dialogCamera = false
        return
      }
      console.log('closeCamera!')
      const stream = this.$refs['video'].srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}

</script>

<style scoped>

</style>
