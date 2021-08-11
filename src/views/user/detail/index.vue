<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div style="margin-bottom: 5px">
              <span style="font-size: x-large">个人信息</span>
              <el-button
                v-if="this.$store.getters.roles[0] === 'inactive_user'"
                size="mini"
                type="primary"
                class="pull-right"
                @click="activationFormVisible = true"
              >
                激活
              </el-button>
              <el-button
                v-if="this.$store.getters.roles[0] !== 'inactive_user'"
                size="mini"
                type="primary"
                class="pull-right"
                @click="passwordFormVisible = true"
              >
                修改密码
              </el-button>
            </div>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
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
                <div class="pull-right">{{ this.$store.getters.sex === 'male' ? '男' : '女' }}</div>
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
      <!--      <el-col :span="18" :xs="24">-->
      <!--        <el-card>-->
      <!--          <div slot="header" class="clearfix">-->
      <!--            <span>基本资料</span>-->
      <!--          </div>-->
      <!--          <el-tabs v-model="activeTab">-->
      <!--            <el-tab-pane label="基本资料" name="userinfo">-->
      <!--              <userInfo :user="user"/>-->
      <!--            </el-tab-pane>-->
      <!--            <el-tab-pane label="修改密码" name="resetPwd">-->
      <!--              <resetPwd :user="user"/>-->
      <!--            </el-tab-pane>-->
      <!--          </el-tabs>-->
      <!--        </el-card>-->
      <!--      </el-col>-->

      <!--      <el-dialog title="填写用户信息" :visible.sync="dialogFormVisible">-->
      <!--        <el-form :model="form" :rules="rules">-->
      <!--          <el-form-item label="姓名" :label-width="formLabelWidth">-->
      <!--            <el-input v-model="form.name" autocomplete="off" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="性别" :label-width="formLabelWidth">-->
      <!--            <el-radio v-model="form.sex" label="male">男</el-radio>-->
      <!--            <el-radio v-model="form.sex" label="female">女</el-radio>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="手机号码" :label-width="formLabelWidth">-->
      <!--            <el-input v-model="form.phone" autocomplete="off" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="邮箱" :label-width="formLabelWidth">-->
      <!--            <el-input v-model="form.email" autocomplete="off" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="学院" :label-width="formLabelWidth">-->
      <!--            <el-input v-model="form.academy" autocomplete="off" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="班级" :label-width="formLabelWidth">-->
      <!--            <el-input v-model="form.class_num" autocomplete="off" />-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--        <div slot="footer" class="dialog-footer">-->
      <!--          <el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <!--          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
      <!--        </div>-->
      <!--      </el-dialog>-->
      <el-dialog title="填写用户信息" :visible.sync="activationFormVisible">
        <el-form ref="activationForm" :model="activationForm" :rules="activationRules" class="login-form">
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="activationForm.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="activationForm.email" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activationFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="activationSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="passwordFormVisible">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
          <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" autocomplete="off" show-password />
          </el-form-item>
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
      <el-dialog title="修改手机号码" :visible.sync="phoneFormVisible">
        <el-form ref="phoneForm" :model="modifyForm" :rules="phoneRules">
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="modifyForm.phone" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="phoneFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="modifySubmit(modifyForm.phone, '')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改邮箱" :visible.sync="emailFormVisible">
        <el-form ref="emailForm" :model="modifyForm" :rules="emailRules">
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="modifyForm.email" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="emailFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="modifySubmit('', modifyForm.email)">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import { Message } from 'element-ui'
import js_sha256 from 'js-sha256'

export default {
  name: 'Detail',
  components: { userAvatar },
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
    const validateOldPassword = (rule, value, callback) => {
      if (js_sha256.sha256(value) !== this.$store.getters.password) {
        callback(new Error('旧密码错误'))
      } else {
        callback()
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value))) {
        callback(new Error('长度至少为6位，且需包含数字和字母'))
      } else {
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
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
      activationFormVisible: false,
      passwordFormVisible: false,
      phoneFormVisible: false,
      emailFormVisible: false,
      loading: false,
      activationForm: {
        // name: '',
        // sex: '',
        phone: '',
        email: ''
        // academy: '',
        // class_num: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      modifyForm: {
        phone: '',
        email: ''
      },
      formLabelWidth: '100px',
      activationRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        email: [{ trigger: 'blur', validator: validateEmail }]
      },
      passwordRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validateOldPassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        repeatPassword: [{ required: true, trigger: 'blur', validator: validateRepeatPassword }]
      },
      phoneRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
      },
      emailRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  created() {
    this.getUser()
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
    activationSubmit() {
      this.$refs.activationForm.validate(async valid => {
        if (valid) {
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
    modifySubmit(phone, email) {
      let currentForm
      if (phone === '') {
        currentForm = this.$refs.emailForm
        this.modifyForm.phone = this.$store.getters.phone
      } else {
        currentForm = this.$refs.phoneForm
        this.modifyForm.email = this.$store.getters.email
      }
      currentForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.$store.dispatch('user/modify', this.modifyForm)
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
      })
      this.loading = false
      this.emailFormVisible = false
      this.phoneFormVisible = false
    }
  }
}
</script>

<style scoped lang="scss">

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
