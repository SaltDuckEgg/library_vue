<template>
  <div style="text-align: center">
    <!--视频流展示-->
    <video ref="video" width="264" height="198" autoplay />
    <!--canvas截取流并展示照片 width:160px;height:120px;position:fixed;left:100%-->
    <canvas ref="canvas" style="display: none" />
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
      token: ''
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
        Message({
          message: '摄像头开启失败，请检查摄像头是否可用！',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    async refresh() {
      this.intv = setInterval(() => this.loop(), 1000)
      this.loop()
    },
    async loop() {
      new Promise((resolve, reject) => {
        const ctx = this.$refs['canvas'].getContext('2d')
        ctx.drawImage(this.$refs['video'], 0, 0, 160, 120)
        this.$refs['canvas'].toBlob(function(blob) {
          const formData = new FormData()
          formData.append('login_img', new window.File([blob], 'login.jpg'))
          if (formData.get('login_img').size < 10000) {
            reject()
          }
          resolve(formData)
        })
      }).then(async(formData) => {
        console.log('formData:')
        console.log(formData.get('login_img'))
        const query = await loginByFace(formData)
        return query.token
      }).then(token => {
        if (token) {
          Message({
            message: '人脸核验成功！',
            type: 'success',
            duration: 5 * 1000
          })
          this.$store.dispatch('user/loginViaToken', token)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            })
            .catch(error => {
              console.log(error)
            })
        }
      }).catch(error => {
        console.log(error)
      })
    },
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
