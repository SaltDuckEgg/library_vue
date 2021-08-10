<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                姓名
                <div class="pull-right">{{ user.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="sex" />
                性别
                <div class="pull-right">{{ user.sex }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="username" />
                学号
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />
                手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />
                学院
                <div class="pull-right">{{ user.academy }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="class" />
                班级
                <div class="pull-right">{{ user.class_num }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />
                用户权限
                <div class="pull-right">{{ user.roles }}</div>
              </li>
            </ul>
          </div>
          <el-button
            v-if="this.$store.getters.roles[0] === 'inactive_user'"
            type="primary"
            @click="dialogTableVisible = true"
          >
            激活
          </el-button>
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
      <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
    return {
      user: {},
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      const roles_dict = {
        'inactive_user': '未激活用户',
        'active_user': '正式用户',
        'administrator': '管理员'
      }
      if (this.$store.getters.roles[0] === 'inactive_user') {
        Message({
          message: '请您先激活账号，以便使用更多功能！',
          type: 'warning',
          duration: 5 * 1000
        })
      }
      this.user.username = this.$store.getters.username
      this.user.sex = this.$store.getters.sex === 'male' ? '男' : '女'
      this.user.name = this.$store.getters.name
      this.user.phone = this.$store.getters.phone
      this.user.email = this.$store.getters.email
      this.user.academy = this.$store.getters.academy
      this.user.class_num = this.$store.getters.class_num
      this.user.roles = roles_dict[this.$store.getters.roles]
    }
  }
}
</script>

<style scoped>

</style>
