<template>
  <div>
    <h1>通过组件的方式引入Echarts柱状图</h1>
    <!-- <p>{{ msg }}</p> -->
    <div class="bar_compon">
      <div :id="id" style="min-width:400px;min-height: 400px;" />
    </div>
  </div>
</template>



<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/gauge')

/* 由于全局引入会将所有的echarts图表打包，导致体积过大，所以在本项目中，采用组建的形式按需引入*/
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// // 引入柱状图组件
// require('echarts/lib/chart/bar')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')

export default {
  name: 'Tempreature',
  props: {
    id: {
      type: String,
      default: 'Tempreature'
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
      const option = {
        series: [{
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 60,
          splitNumber: 12,
          itemStyle: {
            color: '#FFAB91'
          },
          progress: {
            show: true,
            width: 30
          },

          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 30
            }
          },
          axisTick: {
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -52,
            length: 14,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: -20,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            height: '15%',
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 60,
            fontWeight: 'bolder',
            formatter: '{value} °C',
            color: 'auto'
          },
          data: [{
            value: 20
          }]
        },

        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 60,
          itemStyle: {
            color: '#FD7347'
          },
          progress: {
            show: true,
            width: 8
          },

          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [{
            value: 20
          }]

        }
        ]
      }
      this.myChart.setOption(option)
    }
  }
}
</script>



<style>
</style>
