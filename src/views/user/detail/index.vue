<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="22" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div style="margin-bottom: 5px">
              <span style="font-size: x-large">个人信息</span>
              <el-button
                v-if="this.$store.getters.roles[0] === 'inactive_user'"
                size="mini"
                type="primary"
                class="pull-right"
                style="margin-left: 5px; margin-right: 5px"
                @click="activationFormVisible = true"
              >
                激活
              </el-button>
              <el-button
                v-if="this.$store.getters.roles[0] !== 'inactive_user'"
                size="mini"
                type="primary"
                class="pull-right"
                style="margin-left: 5px; margin-right: 5px"
                @click="passwordFormVisible = true"
              >
                修改密码
              </el-button>
              <el-button
                v-if="this.$store.getters.roles[0] === 'administrator'"
                size="mini"
                type="primary"
                class="pull-right"
                style="margin-left: 5px; margin-right: 5px"
                @click="dialogVisible = true; close = false"
              >
                录入人脸
              </el-button>
            </div>
          </div>
          <div>
            <div class="text-center">
              <el-upload
                class="avatar-uploader"
                action="http://124.71.225.17:8000/user/avatar/"
                :http-request="upLoad"
                :headers="headers"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :disabled="this.$store.getters.roles[0] === 'inactive_user'"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="" style="width: 100px; height: 100px">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                姓名
                <div class="pull-right">{{ this.$store.getters.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="sex" />
                性别
                <div class="pull-right">{{ this.$store.getters.sex }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="username" />
                学号
                <div class="pull-right">{{ this.$store.getters.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />
                手机号码
                <div class="pull-right">
                  {{ this.$store.getters.phone }}
                  <svg-icon
                    v-if="this.$store.getters.roles[0] !== 'inactive_user'"
                    icon-class="edit"
                    @click="phoneFormVisible = true"
                  />
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />
                邮箱
                <div class="pull-right">
                  {{ this.$store.getters.email }}
                  <svg-icon
                    v-if="this.$store.getters.roles[0] !== 'inactive_user'"
                    icon-class="edit"
                    @click="emailFormVisible = true"
                  />
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />
                学院
                <div class="pull-right">{{ this.$store.getters.academy }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="class" />
                班级
                <div class="pull-right">{{ this.$store.getters.class_num }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />
                用户权限
                <div class="pull-right">{{ roles_dict[this.$store.getters.roles] }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-dialog title="填写用户信息" :visible.sync="activationFormVisible">
        <el-form
          ref="activationForm"
          :model="activationForm"
          :rules="activationRules"
          class="login-form"
          @keyup.enter.native="activationSubmit"
        >
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input v-model="activationForm.newPassword" autocomplete="off" show-password />
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repeatPassword">
            <el-input v-model="activationForm.repeatPassword" autocomplete="off" show-password />
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="activationForm.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
            <el-row :gutter="0">
              <el-col :span="16">
                <el-input v-model="activationForm.sms_code" />
              </el-col>
              <el-col :span="8" style="padding-left: 10px">
                <el-button :disabled="codeDisabled" style="width: 150px" @click="getSMSCode">{{ btnText }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <!--          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">-->
          <!--            <el-input v-model="activationForm.email" autocomplete="off" />-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activationFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="activationSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="passwordFormVisible">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" @keyup.enter.native="passwordSubmit">
          <!--          <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">-->
          <!--            <el-input v-model="passwordForm.oldPassword" autocomplete="off" show-password />-->
          <!--          </el-form-item>-->
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" autocomplete="off" show-password />
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repeatPassword">
            <el-input v-model="passwordForm.repeatPassword" autocomplete="off" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="passwordFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="passwordSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改手机号码" :visible.sync="phoneFormVisible" @keyup.enter.native="modifyPhone">
        <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRules">
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="phoneForm.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
            <el-row :gutter="0">
              <el-col :span="16">
                <el-input v-model="phoneForm.sms_code" />
              </el-col>
              <el-col :span="8" style="padding-left: 10px">
                <el-button :disabled="codeDisabled" style="width: 150px" @click="getSMSCode">{{ btnText }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="phoneFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="modifyPhone">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改邮箱" :visible.sync="emailFormVisible">
        <el-form ref="emailForm" :model="emailForm" :rules="emailRules" @keyup.enter.native="modifyEmail">
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="emailForm.email" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="emailFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="modifyEmail">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="人脸照片录入"
        :visible.sync="dialogVisible"
        width="700px"
        @close="close = true"
      >
        <Face :close="close" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false; close = true">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false; close = true">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { activationGetUid, uploadAvatar } from '@/api/user'
import Face from './face'

// import js_sha256 from 'js-sha256'

export default {
  name: 'Detail',
  components: { Face },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!(/^1[3-9]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!(/^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(value))) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    // const validateOldPassword = (rule, value, callback) => {
    //   if (js_sha256.sha256(value) !== this.$store.getters.password) {
    //     callback(new Error('旧密码错误'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateNewPassword = (rule, value, callback) => {
      if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value))) {
        callback(new Error('长度至少为6位，且需包含数字和字母'))
      } else {
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      let currentForm = this.passwordForm
      if (this.activationFormVisible) {
        currentForm = this.activationForm
      }
      console.log(currentForm)
      if (value !== currentForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
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
      user: {},
      roles_dict: {
        'inactive_user': '未激活用户',
        'active_user': '正式用户',
        'administrator': '管理员'
      },
      imageUrl: this.$store.getters.avatar,
      headers: {
        'Authorization': 'JWT ' + getToken()
      },
      activationFormVisible: false,
      passwordFormVisible: false,
      phoneFormVisible: false,
      emailFormVisible: false,
      dialogVisible: false,
      close: false,
      loading: false,
      activationForm: {
        newPassword: '',
        repeatPassword: '',
        phone: '',
        uid: '',
        sms_code: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      emailForm: {
        email: ''
      },
      phoneForm: {
        phone: '',
        uid: '',
        sms_code: ''
      },
      modifyForm: {
        phone: '',
        email: ''
      },
      formLabelWidth: '100px',
      codeDisabled: false,
      btnText: '发送验证码',
      countDown: 120,
      isPhoneVerified: false,
      activationRules: {
        newPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        repeatPassword: [{ required: true, trigger: 'blur', validator: validateRepeatPassword }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
        // email: [{ trigger: 'blur', validator: validateEmail }]
      },
      passwordRules: {
        // oldPassword: [{ required: true, trigger: 'blur', validator: validateOldPassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        repeatPassword: [{ required: true, trigger: 'blur', validator: validateRepeatPassword }]
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      emailRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  created() {
    this.getUser()
  },
  mounted() {
    this.time = this.countDown
  },
  methods: {
    getUser() {
      if (this.$store.getters.roles[0] === 'inactive_user') {
        Message({
          message: '请您先激活账号，以便使用更多功能！',
          type: 'warning',
          duration: 5 * 1000
        })
      }
    },
    getSMSCode() {
      let currentForm = this.activationForm
      if (this.phoneFormVisible) {
        currentForm = this.phoneFormVisible
      }
      this.$refs.activationForm.validateField('phone', errorMessage => {
        if (errorMessage) {
          Message({
            message: '请输入正确的手机号码',
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          activationGetUid({ phone: currentForm.phone })
            .then(response => {
              currentForm.uid = response.data.uid
              console.log(this.activationForm.uid)
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
    activationSubmit() {
      this.$refs.activationForm.validate(async valid => {
        if (valid && this.activationForm.uid !== '') {
          this.loading = true
          await this.$store.dispatch('user/activate', this.activationForm)
          await this.$store.dispatch('user/getInfo')
          await this.getUser()
        } else {
          Message({
            message: '请确认输入用户信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
      this.loading = false
      this.activationFormVisible = false
    },
    passwordSubmit() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.$store.dispatch('user/password', this.passwordForm)
          await this.$store.dispatch('user/getInfo')
          await this.getUser()
        } else {
          Message({
            message: '请确认输入密码信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
      this.loading = false
      this.passwordFormVisible = false
    },
    modifyPhone() {
      this.$refs.phoneForm.validate(async valid => {
        if (valid && this.phoneForm.uid !== '') {
          this.loading = true
          await this.$store.dispatch('user/currentUserPhone', this.phoneForm)
          await this.$store.dispatch('user/getInfo')
          await this.getUser()
        } else {
          Message({
            message: '请确认输入用户信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
      this.loading = false
      this.phoneFormVisible = false
    },
    modifyEmail() {
      this.$refs.emailForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.$store.dispatch('user/currentUserEmail', this.emailForm)
          await this.$store.dispatch('user/getInfo')
          await this.getUser()
        } else {
          Message({
            message: '请确认输入信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
        this.loading = false
        this.emailFormVisible = false
      })
    },
    beforeAvatarUpload(file) {
      if (file.type.indexOf('image/') === -1) {
        Message({
          message: '文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件！',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          // console.log('readerResult：', reader.result)
        }
      }
    },
    upLoad(file) {
      const formData = new FormData()
      formData.append('avatar', file.file)
      console.log('avatarFile：', file)
      uploadAvatar(formData).then(res => {
        // console.log('avatarResponse：', res)
        this.imageUrl = res.data.avatar
        Message({
          message: '头像上传成功！',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('user/modifyAvatar', res.data.avatar)
      })
    }
  }
}
</script>

<style scoped lang="scss">

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.svg-container {
  //padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}

</style>
