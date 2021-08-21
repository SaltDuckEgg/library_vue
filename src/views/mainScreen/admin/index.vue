<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row display="flex" flex-wrap="wrap" :gutter="8" style="margin-bottom:50px;">
      <!-- 进度条 -->

      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="padding-right:32px;margin-right:120px;"
      >
        <box-card />
      </el-col>

      <el-col :xs="{span: 96}" :sm="{span: 48}" :md="{span: 48}" :lg="{span: 16}" :xl="{span: 12}">
        <imageplayer />
      </el-col>
    </el-row>
    <el-row style="margin-bottom:100px;">
      <temperandHumi />
    </el-row>

    <el-row :gutter="1" style="margin-bottom:50px">
      <el-col :xs="4" :sm="6" :lg="8" :span="12">
        <div>
          <topstudent />
        </div>
      </el-col>

      <!-- 热书榜 -->
      <el-col
        :xs="{span: 36}"
        :sm="{span: 18}"
        :md="{span: 18}"
        :lg="{span: 9}"
        :xl="{span: 9}"
        style="padding-right:8px;"
      >
        <!-- style="background:#fff;padding-right:8px;margin-bottom:30px;" -->

        <!-- <transaction-table /> -->
        <topbook />
      </el-col>
      <!-- 学院入馆top -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 3}"
        :xl="{span: 6}"
        style="padding-right:8px;"
      >
        <!-- <todo-list /> -->
        <topacademy id="topacademy" />
        <!-- <topstudent /> -->
      </el-col>
    </el-row>
    <!-- <el-row :gutter="32">
      <div>
        <imageplayer />
      </div>
    </el-row>-->

    <!-- <el-row :gutter="32">
      <document />
    </el-row>-->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import chart from './components/DrawBar'
import tempreatrue from './components/Temperature'
import topbook from './components/TopBook'
import topacademy from './components/TopAcademy'
import topstudent from './components/TopStudent'
import imageplayer from './components/ImagePlayer'
import temperandHumi from './components/TemperandHumi'
import document from './components/Document';
const lineChartData = {
  // 借还书
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    chart,
    tempreatrue,
    topacademy,
    topbook,
    topstudent,
    imageplayer,
    temperandHumi,
    document
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  // background: url("~@/assets/login_bg/library_img.jpeg");
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  background-color: rgba(233, 232, 182, 0.096);

  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
