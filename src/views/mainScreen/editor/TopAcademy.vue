<template>
  <div>
    <h1>学院入馆人数饼图</h1>
    <!-- <p>{{ msg }}</p> -->
    <div class="bar_compon">
      <div :id="id" style="min-width:400px;min-height: 500px;" />
    </div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')

export default {
  name: 'BookTop',
  props: {
    id: {
      type: String,
      default: 'BookTop'
    }
  },
  data() {
    return {
      msg: '柱状图',
      chart: null
    }
  },
  mounted() {
    this.DrawBar()
  },
  methods: {
    DrawBar() {
      this.chartDom = document.getElementById(this.id)
      this.myChart = echarts.init(this.chartDom)
      this.fetchData()
      this.myChart.setOption(this.option)
    },
    fetchData() {
      this.option = {
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [10, 175],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 25
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
