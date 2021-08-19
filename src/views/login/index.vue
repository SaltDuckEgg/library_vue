<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">中南大学图书馆管理系统</h3>
    </div>
    <div v-if="loginMode===1" style="display: flex;width: 100%;align-items: center;justify-content: center">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="off"
        label-position="left"
      >

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="学号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-top:10px;font-size: 16px"
          @click.native.prevent="handleLogin"
        >登录
        </el-button>

      </el-form>
    </div>
    <div v-if="loginMode===2" class="qrcode-login">
      <QRLogin :login-mode="loginMode" @reverse="loginMode=4" />
    </div>
    <div v-if="loginMode===3" class="smscode-login" style="display: flex;width: 100%;align-items: center;justify-content: center">
      <el-form ref="phoneForm" class="login-form" label-position="left" :model="phoneForm" :rules="phoneRules">
        <el-form-item type="text" tabindex="1" prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="phone" />
          </span>
          <el-input v-model="phoneForm.phone" placeholder="手机号码" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="smscode"
            v-model="phoneForm.sms_code"
            placeholder="验证码"
            name="smscode"
            tabindex="2"
            autocomplete="off"
            style="width: 140px"
          />
          <el-button
            type="primary"
            :disabled="codeDisabled"
            class="sms_button"
            @click="getSMSCode"
          >{{ btnText }}</el-button>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-top:10px;font-size: 16px"
          @click.native.prevent="SMSCodeLogin"
        >登录
        </el-button>
      </el-form>
    </div>
    <div v-if="loginMode===4" class="face-login">
      <FaceLogin />
    </div>
    <div class="switch-login">
      <span class="login-mode" @click="loginMode=1">
        <svg-icon icon-class="login-password" class="login-svg-icon" />
      </span>
      <span class="login-mode" @click="loginMode=2">
        <svg-icon icon-class="login-qrcode" class="login-svg-icon" />
      </span>
      <span class="login-mode" @click="loginMode=3">
        <svg-icon icon-class="login-smscode" class="login-svg-icon" />
      </span>
      <span class="login-mode" @click="loginMode=4">
        <svg-icon icon-class="login-face" class="login-svg-icon" />
      </span>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import QRLogin from '@/views/login/components/QRLogin'
import FaceLogin from '@/views/login/components/face'
import { Message } from 'element-ui'
import { loginGetUid } from '@/api/user'

export default {
  name: 'Login',
  components: { QRLogin, FaceLogin },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的学号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不少于6位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!(/^1[3-9]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginMode: 1,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      phoneForm: {
        phone: '',
        uid: '',
        sms_code: ''
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      btnText: '发送验证码',
      codeDisabled: false,
      countDown: 120,
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.time = this.countDown
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
    this.close = true
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((roles) => {
              // console.log('roles', roles)
              if (this.$store.getters.roles[0] === 'administrator') {
                this.loginMode = 4
                Message({
                  message: '您正在以管理员身份登陆，请进行人脸核验',
                  type: 'warning',
                  duration: 5 * 1000
                })
                this.$store.dispatch('user/resetRoles')
                this.loading = false
              } else {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    getSMSCode() {
      this.$refs.phoneForm.validateField('phone', errorMessage => {
        if (errorMessage) {
          Message({
            message: '请输入正确的手机号码',
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          loginGetUid({ phone: this.phoneForm.phone })
            .then(response => {
              this.phoneForm.uid = response.data.uid
              console.log(this.phoneForm.uid)
              Message({
                message: '已发送验证码！',
                type: 'success',
                duration: 5 * 1000
              })
              const timer = setInterval(() => {
                this.time--
                this.btnText = `${this.time}s后重新发送`
                this.codeDisabled = true
                if (this.time === 0) {
                  this.codeDisabled = false
                  this.btnText = '重新发送'
                  this.time = this.countDown
                  clearInterval(timer)
                }
              }, 1000)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    SMSCodeLogin() {
      this.$refs.phoneForm.validate(valid => {
        if (valid && this.phoneForm.uid !== '') {
          this.loading = true
          this.$store.dispatch('user/loginByPhone', this.phoneForm)
            .then((roles) => {
              // console.log('roles', roles)
              if (roles === 'administrator') {
                this.loginMode = 4
                Message({
                  message: '您正在以管理员身份登陆，请进行人脸核验',
                  type: 'warning',
                  duration: 5 * 1000
                })
                this.$store.dispatch('user/resetRoles')
                this.loading = false
              } else {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          Message({
            message: '请确认输入用户信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    background-color: transparent;
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      border-bottom: solid #fff 1px;
      outline: none;
      padding: 12px 5px 12px 15px;
      font-size: 16px;
      letter-spacing: 1px;
      color: $light_gray;
      caret-color: $cursor;
    }
  }

  .el-form-item {
    border: 0 solid;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  background: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  width: 450px;

    .h3 {
      margin: 0 0 30px;
      padding: 0;
      color: #fff;
      text-align: center;
    }

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    overflow: hidden;
    align-items: center;
    justify-content: center
  }

  .svg-container {
    padding: 6px 5px 6px 5px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 0;
    top: 7px;
    font-size: 16px;
    color: lightgray;
    cursor: pointer;
    user-select: none;
  }

  .el-form-item{
    font-size: 16px;
    .sms_button {
      width:43%;
      font-size: 16px;
      margin-right: 20px;
      margin-top: 5px;
      height: 40px;
      float: right
    }
  }
}

.switch-login {
  margin-top: 30px;
  text-align: center;
  width: 100%;

  .login-mode {
    border-radius: 50%;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    color: $light_gray;
    vertical-align: middle;
    width: 42px;
    height: 42px;
    margin-left: 20px;
    margin-right: 20px;
    display: inline-block;
  }

  .login-mode:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .login-svg-icon {
    box-shadow: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    margin: 7px;
    width: 26px;
    height: 26px;
  }
}
</style>
