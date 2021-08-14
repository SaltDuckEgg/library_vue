<template>
  <div>
    <h1>通过组件的方式引入Echarts柱状图</h1>
    <p>{{ msg }}</p>
    <!-- <div class="bar_compon"> -->
    <div :id="id" style="min-width:400px;min-height: 400px;" />
    <!-- </div> -->
  </div>
</template>
<script>
/* 由于全局引入会将所有的echarts图表打包，导致体积过大，所以在本项目中，采用组建的形式按需引入*/
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  name: 'DrawBar',
  props: {
    id: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      msg: '柱状图',
      chart: null
    }
  },
  mounted() {
    this.DrawBarChart()
  },
  methods: {
    DrawBarChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const colors = ['#179F5D', '#4A8AF3', '#DA4C3F']
      const option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['苹果', '香蕉', '梨']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销量',
            min: 0,
            max: 250,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          {
            type: 'value',
            name: '销量',
            min: 0,
            max: 250,
            position: 'right',
            offset: 50,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          {
            type: 'value',
            name: '销量',
            min: 0,
            max: 250,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} 个'
            }
          }
        ],
        series: [
          {
            name: '苹果',
            type: 'bar',
            data: [24, 96, 129, 238, 160, 180, 241]
          },
          {
            name: '香蕉',
            type: 'bar',
            yAxisIndex: 1,
            data: [25.69, 59, 156, 11, 23, 202]
          },
          {
            name: '梨',
            type: 'line',
            yAxisIndex: 2,
            data: [24, 16, 10, 20, 100, 170, 201]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
<style>
</style>
