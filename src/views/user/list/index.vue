<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名（学号）"
        style="width: 150px;"
        class="filter-item"
        @change="getList"
        @keyup.enter.native="getList"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 150px;"
        class="filter-item"
        @change="getList"
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.sex"
        placeholder="性别"
        clearable
        style="width: 110px"
        class="filter-item"
        @change="getList"
      >
        <el-option label="男" value="男" />
        <el-option label="女" value="女" />
      </el-select>
      <el-select
        v-model="listQuery.academy"
        placeholder="学院"
        clearable
        style="width: 180px"
        class="filter-item"
        @change="getList"
      >
        <el-option
          v-for="item in academy_class"
          :key="item.academy"
          :label="item.academy"
          :value="item.academy"
        />
      </el-select>
      <el-select
        v-model="listQuery.class_num"
        placeholder="班级"
        clearable
        style="width: 180px"
        class="filter-item"
        @change="getList"
      >
        <el-option
          v-for="item in classNumOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        plain
        @click="getList"
      >搜索</el-button>
    </div>

    <el-table
      :key="userTableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'id', order: 'ascending'}"
    >
      <el-table-column label="ID" prop="id" sortable align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" prop="username" sortable width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.academy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.class_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ roles_dict[row.roles] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type=" row.in_lib ? 'success' : 'danger' ">
            {{ row.in_lib ? '在馆' : '离馆' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.roles!=='administrator'"
            type="success"
            style="color:gray;"
            icon="el-icon-s-tools"
            plain
            circle
            @click="handleModify(row)"
          />
          <el-button
            v-if="row.roles!=='administrator' && !row.in_lib"
            type="danger"
            icon="el-icon-delete-solid"
            circle
            plain
            @click="handleDelete(row,$index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 450px; margin-left:80px;height:400px;"
        @keyup.enter.native="modifyData()"
      >
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="temp.name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="temp.sex" label="男" disabled>男</el-radio>
          <el-radio v-model="temp.sex" label="女" disabled>女</el-radio>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="temp.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="temp.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学院" :label-width="formLabelWidth">
          <el-input v-model="temp.academy" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="temp.class_num" autocomplete="off" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyData()">确认</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { fetchAcademyClass, fetchList } from '@/api/user'
import waves from '@/directive/waves'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'

export default {
  name: 'List',
  components: { Pagination },
  directives: { waves },
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
      userTableKey: 0,
      roles_dict: {
        'inactive_user': '未激活用户',
        'active_user': '正式用户',
        'administrator': '管理员'
      },
      academy_class: [],
      list: [],
      listLoading: false,
      listQuery: {
        academy: '',
        class_num: '',
        username: '',
        name: '',
        sex: '',
        page: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      formLabelWidth: '100px',
      temp: {},
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        email: [{ trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  computed: {
    classNumOptions: function() {
      if (this.listQuery.academy !== '') {
        return this.academy_class.filter(v => v.academy === this.listQuery.academy)[0].class_num // 返回选中学院包含的班级
      } else {
        const classes = []
        this.academy_class.forEach(v => classes.push(v.class_num))
        return classes.flat() // 返回包含所有班级的数组
      }
    }
  },
  created() {
    this.getList()
    this.getAcademyClass()
  },
  methods: {
    getList() {
      console.log('listQuery', this.listQuery)
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getAcademyClass() {
      this.listLoading = true
      fetchAcademyClass().then(response => {
        console.log('返回的学院班级结果：', response.data.academy_info)
        response.data.academy_info.forEach(v => console.log(v))
        this.academy_class = response.data.academy_info
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleModify(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      if (row.in_lib) {
        this.$message({
          type: 'error',
          message: '在馆用户无法删除'
        })
      } else {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.$store.dispatch('user/delete', row.id)
          await this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    modifyData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          await this.$store.dispatch('user/modify', this.temp)
          await this.getList()
        } else {
          Message({
            message: '请确认输入信息正确！',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>
