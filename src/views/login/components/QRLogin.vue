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
            请在客户端登录
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

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { codeQuery, refreshCode } from '@/api/qrLogger'
import QRCode from 'qrcode'

@Component({})
export default class QRLogin extends Vue {
  updated = 0
  qr = ''
  uid = ''

  async refresh() {
    this.qr = ''
    this.uid = await refreshCode()
    this.qr = await QRCode.toDataURL(this.uid)
    this.updated = Date.now()
    this.intv = setInterval(() => this.loop(), 1000)
    this.loop()
  }

  expired = false
  scanned = false
  token = ''

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
      this.$store.dispatch('user/loginViaToken', this.loginViaToken)
        .then(() => {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        })
        .catch(() => {
        })
    }
  }

  intv = 0 as any

  mounted() {
    this.refresh()
  }

  beforeDestroy() {
    clearInterval(this.intv)
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
