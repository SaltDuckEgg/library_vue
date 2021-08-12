<template>
  <div class="app-container">
    <div class="filter-container">
      <!--  <el-autocomplete
        v-model="listQuery.title"
        class="filter-item"
        style="width: 200px;"
        :fetch-suggestions="querySearch"
        placeholder="书名"
        @keyup.enter.native="handleFilter"
      />-->
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px;"
        class="filter-item"
        @change="handleFilter"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="类别"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in categyOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input
        v-model="fuzzy"
        class="filter-item"
        placeholder="模糊搜索"
        style="width: 200px;"
        @keyup.enter.native="handleFilter_fuzzy"
      />

      <!-- @keyup.enter.native="handleFilter_fuzzy" -->

      <!-- <el-select
        v-model="listQuery.type"
        placeholder="Type"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>-->
      <!-- <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        plain
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        plain
        @click="handleCreate"
      >增加</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="success"
        icon="el-icon-download"
        plain
        @click="handleDownload"
      >导出</el-button>
      <!-- <el-checkbox
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >categy</el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>`
      <el-table-column label="更新日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <!-- <span>{{ row.timestamp }}</span>` -->
        </template>
      </el-table-column>
      <el-table-column label="书名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!-- <el-tag>{{ row.categy }}</el-tag>
          -->
          <el-tag
            effect="plain"
            type="danger"
            size="mini"
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.categy }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" style="color:black;" @click="handleUpdate(row)">{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出版社" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span class="link-type" style="color:black;" @click="handleUpdate(row)">{{ row.pub }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类别" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.categy }}</span>
        </template>
      </el-table-column>-->

      <el-table-column label="关键词" class-name="status-col" min-width="200">
        <template slot-scope="{row}">
          <span class="link-type" style="color:black;" @click="handleUpdate(row)">{{ row.kw }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类号" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <span>{{ row.clsify_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="库存" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="总数" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.total_pageviews" class="link-type">{{ row.total_pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column
        label="编辑 / 删除"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="success"
            style="color:gray;"
            icon="el-icon-s-tools"
            plain
            circle
            @click="handleUpdate(row)"
          />
          <!-- size="mini" -->

          <!-- <el-button
            v-if="row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >Publish</el-button>-->

          <!-- <el-button
            v-if="row.status!='draft'"
            size="mini"
            @click="handleModifyStatus(row,'draft')"
          >Draft</el-button>-->
          <!-- <el-button
            style="color:gray;"
            type="danger"
            icon="el-icon-error"
            plain
          >删除</el-button>-->
          <el-button
            type="danger"
            icon="el-icon-delete-solid"
            circle
            plain
            @click="handleDelete(row,$index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 450px; margin-left:80px;height:1000px;"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="temp.author" />
        </el-form-item>

        <el-form-item label="出版社">
          <el-input v-model="temp.pub" />
        </el-form-item>
        <el-form-item label="类别" prop="title">
          <el-select v-model="temp.categy" class="filter-item" placeholder="Please select">
            <el-option v-for="item in categyOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类号">
          <el-input v-model="temp.clsify_num" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="temp.kw" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <!-- <el-form-item label="总数" prop="title">
          <el-input v-model="temp.pageviews" />
        </el-form-item>-->
        <!-- <el-form-item label="库存" prop="title"> -->
        <!-- <el-input v-model="temp.total_pageviews" />
        </el-form-item>-->

        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>-->

        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>-->

        <el-form-item label="简介">
          <el-input
            v-model="temp.summary"
            :autosize="{ minRows: 3, maxRows: 20}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ffetchList, dataTranFormer, dataTest, ffetchList_fuzzy, updateBook, deleteBook, createBook, fetchAlltitle } from '@/api/book'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import Pagination from '@/views/book/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      // console.log('statusFilter(status)')
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      // console.log('typeFilter(type)')
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      restaurants: [{ 'value': '三全鲜食（北新泾店）' }, { 'value': '长宁区新渔路144号' }],
      // restaurants: this.a(),

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      fuzzy: '',
      listQuery: {
        category: undefined,
        book_id: undefined,
        author: undefined,
        // importance: undefined,
        title: undefined,
        type: undefined,
        page_size: 20,
        page: 1
        // sort: '+id'
      },

      // importanceOptions: [1, 2, 3],
      // categyOptions: ['G 古典文学', 'Z 传记', 'W 外国名著', 'H 回忆录', 'W 文学', 'C 成长', 'H 绘本', 'K 科幻', 'L 历史', 'X 现当代文学', 'X 小说',
      //   'X 心理学', 'Q 青春', 'S 诗歌', 'M 漫画', 'S 随笔', 'T 推理', 'W 文化', 'Y 言情', 'X 悬疑', 'Y 艺术', 'S 社会学'].sort(),
      categyOptions: ['古典文学', '传记', '外国名著', '回忆录', '文学', '成长', '绘本', '科幻', '历史', '现当代文学', '小说',
        '心理学', '青春', '诗歌', '漫画', '随笔', '推理', '文化', '言情', '悬疑', '艺术', '社会学'].sort(),

      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: true,
      temp: {
        id: undefined,
        // importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        categy: [{ required: true, message: '类型未填写', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: '必选项', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    console.log('created() ')

    this.getList()
  },
  mounted() {
    // this.restaurants = this.loadAll()
    // this.restaurants = fetchAlltitle()

  },
  methods: {
    getList() {
      console.log('getList()')
      // this.allTitle = fetchAlltitle()

      this.listLoading = true
      ffetchList(this.listQuery).then(response => {
        // this.list = dataTest()
        this.list = dataTranFormer(response.data.results)
        this.total = response.data.count
        // console.log(this.list)
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      // console.log('handleFilter()的参数：')
      // console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    handleFilter_fuzzy() {
      this.listQuery.page = 1
      console.log(this.fuzzy)
      ffetchList_fuzzy(this.fuzzy).then(response => {
        // this.list = dataTest()
        console.response
        this.list = dataTranFormer(response.data.results)
        this.total = this.list.length
        // console.log(this.list)
        // this.total = response.data.total

        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    handleModifyStatus(row, status) {
      console.log('handleModifyStatus()')
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      console.log('sortChange(data)')
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      console.log('sortByID(order)')
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      console.log('resetTemp()')
      // this.temp = {
      //   id: undefined,
      //   remark: '',
      //   timestamp: new Date(),
      //   title: '',
      //   status: 'published',
      //   type: ''
      // }
      this.temp = {
        display_time: '暂无',
        categy: '暂无',
        status: '暂无',
        timestamp: new Date().toString(),
        title: '暂无',
        pub: '暂无',
        kw: '暂无',
        clsify_num: '暂无',
        summary: '暂无 ',
        author: '暂无',
        id: '暂无',
        pageviews: 0,
        total_pageviews: 0,
        price: '0.0',
        isbn: '暂无',
        press: '暂无'

      }
    },
    handleCreate() {
      console.log('handleCreate()')
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData()')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createBook(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate(row)')
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log('updateData()')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log('debug tempData')
          console.log(tempData)
          updateBook(tempData).then((response) => {
            console.log(response)
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log('handleDelete(row, index)')
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      // this.list.splice(index, 1)
      deleteBook(row)
      this.listQuery.page = 1
      self.ffetchList(this.listQuery)
    },
    handleDownload() {
      console.log('handleDownload() ')
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      console.log('formatJson(filterVal)')
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass(key) {
      console.log('getSortClass()')
      // console.log(key)
      const sort = this.list.sort
      // console.log(sort)
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      // console.log(1)
      // return [{ 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' }]
      return [{ 'value': '三全鲜食（北新泾店）' }, { 'value': '长宁区新渔路144号' }]
    }

  }
}

</script>

<style lang="scss" scoped>
.input {
  width: "100px";
  // display: inline-block;
  // font-size: 14px;
  // line-height: 50px;
  // margin-left: 8px;

  // .no-redirect {
  //   color: #97a8be;
  //   cursor: text;
  // }
}
</style>
