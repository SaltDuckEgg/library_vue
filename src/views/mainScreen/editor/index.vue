<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <pan-thumb :image="avatar" style="float: left">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span>
      </div>
    </div>
    <el-col :span="40">
      <el-row :gutter="200">
        <el-col :span="11">
          <div>
            <topbook id="topBook" />
          </div>
        </el-col>
        <el-col :span="11">
          <div>
            <topacademy />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <tempreatrue id="temp" />
        </div>
      </el-row>
      <el-row>
        <div class="bar_container">
          <chart id="histogram_graph" />
        </div>
      </el-row>
      <div>
        <img :src="emptyGif" class="emptyGif" />
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'
import chart from '@/views/mainScreen/editor/DrawBar'
import tempreatrue from '@/views/mainScreen/editor/Temperature'
import topbook from '@/views/mainScreen/editor/TopBook'
import topacademy from '@/views/mainScreen/editor/TopAcademy'

export default {
  name: 'DashboardEditor',
  components: { PanThumb, GithubCorner, chart, tempreatrue, topbook, topacademy },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  // background-color: #f1f3f3;
  background-image: "C:\Users\LianGaoGe\Desktop\work\project\egg\src\bg.jpg";
  min-height: 100vh;
  padding: 50px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
