<template>
  <div style="display: flex;flex-direction: column;align-items: center;">
    <div class="title-container">
      <h2 class="title" style="color: #eee">扫码登录</h2>
    </div>
    <div v-loading="!qr" style="position: relative;width: 200px;height: 200px;padding: 0;margin: 0">
      <img v-if="qr" :src="qr" style="width: 100%" alt="qr-code">
      <transition name="fade">
        <div v-if="token" class="qr-overlay">
          <div>
            <i class="el-icon-success" style="color: green" />
            已登录
          </div>
        </div>
        <div v-if="scanned" class="qr-overlay">
          <div>
            <i class="el-icon-success" style="color: green" />
            请在客户端点击确定
          </div>
        </div>
        <div v-if="expired" class="qr-overlay">
          <div>二维码已过期</div>
          <el-button type="text" @click="refresh"><i class="el-icon-refresh" /> 刷新</el-button>
        </div>
      </transition>

    </div>
    <el-button type="text" @click="refresh"><i class="el-icon-refresh" />手动刷新</el-button>
  </div>
</template>

<script>
import { codeQuery, refreshCode } from '@/api/qrLogger'
import QRCode from 'qrcode'

export default {
  data() {
    return {
      updated: 0,
      qr: '',
      uid: '',
      redirect: null,
      otherQuery: {},
      expired: false,
      scanned: false,
      token: '',
      intv: 0
    }
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
  mounted() {
    this.refresh()
  },
  beforeDestroy() {
    clearInterval(this.intv)
  },
  methods: {
    async refresh() {
      this.qr = ''
      this.uid = await refreshCode()
      this.qr = await QRCode.toDataURL(this.uid)
      this.updated = Date.now()
      this.intv = setInterval(() => this.loop(), 1000)
      this.loop()
    },

    async loop() {
      const query = await codeQuery(this.uid)
      this.expired = query.expired
      if (this.expired) {
        clearInterval(this.intv)
        this.intv = 0
      }
      this.scanned = query.scanned
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
div.qr-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffffee;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

</style>
