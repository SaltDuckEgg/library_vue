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
              <userAvatar :user="user"/>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user"/>
                姓名
                <div class="pull-right">{{ user.name }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="sex"/>
                性别
                <div class="pull-right">{{ user.sex }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="username"/>
                学号
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone"/>
                手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email"/>
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree"/>
                学院
                <div class="pull-right">{{ user.academy }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="class"/>
                班级
                <div class="pull-right">{{ user.class_num }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples"/>
                用户权限
                <div class="pull-right">{{ user.roles }}</div>
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
      user: {
        // username: '8207181829',
        // sex: 'male',
        // name: '水',
        // phone: '12345678',
        // email: '12345678@qq.com',
        // academy: '自动化学院',
        // class_num: '1802',
        // roles: 'administrator'
      }
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
      console.log(this.$store.getters.roles)
      console.log(this.$store.getters.roles === 'inactive_user')
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
