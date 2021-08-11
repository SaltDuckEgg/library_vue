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
                @click="dialogFormVisible = true"
              >
                激活
              </el-button>
              <el-button
                v-if="this.$store.getters.roles[0] !== 'inactive_user'"
                size="mini"
                type="primary"
                class="pull-right"
                @click="dialogFormVisible = true"
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
                <div class="pull-right">{{ this.$store.getters.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />
                用户邮箱
                <div class="pull-right">{{ this.$store.getters.email }}</div>
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
      <el-dialog title="填写用户信息" :visible.sync="dialogFormVisible">
        <el-form ref="activationForm" :model="activationForm" :rules="rules">
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="activationForm.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="activationForm.email" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import { Message } from 'element-ui'

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
    return {
      user: {},
      roles_dict: {
        'inactive_user': '未激活用户',
        'active_user': '正式用户',
        'administrator': '管理员'
      },
      dialogFormVisible: false,
      loading: false,
      activationForm: {
        // name: '',
        // sex: '',
        phone: '',
        email: ''
        // academy: '',
        // class_num: ''
      },
      formLabelWidth: '100px',
      rules: {
        phone: [{ required: true, trigger: 'change', validator: validatePhone }],
        email: [{ trigger: 'blur', validator: validateEmail }]
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
    handleSubmit() {
      this.$refs.activationForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.$store.dispatch('user/activation', this.activationForm)
          await this.$store.dispatch('user/getInfo')
          await this.getUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.loading = false
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>
