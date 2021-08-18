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
import { getTopAcademy } from '@/api/user'
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
      getTopAcademy().then(respone => {
        var arr = respone.data.academy_info
        this.data = []
        for (var i = 0; i < arr.length; i++) {
          this.data.push({
            name: arr[i].academy,
            value: 30 + Math.random() * 20
          })
        }
        // console.log(this.data)
        this.option = {
          textStyle: {
            fontSize: 16
          },
          title: {
            text: '这是个title',
            left: 'center',
            textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 14
            }
          },

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
              label: {
                position: 'inner',
                fontSize: 14
              },
              name: '面积模式',
              type: 'pie',
              // radius: [20, 150],
              radius: [20, '70%'],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 6
              },
              data: this.data
              // [
              //   { value: 40, name: 'rose 1' },
              //   { value: 38, name: 'rose 2' },
              //   { value: 32, name: 'rose 3' },
              //   { value: 30, name: 'rose 4' },
              //   { value: 28, name: 'rose 5' },
              //   { value: 26, name: 'rose 6' },
              //   { value: 22, name: 'rose 7' },
              //   { value: 18, name: 'rose 8' }
              // ]
            }
          ]
        }
        this.myChart.setOption(this.option)

      })

    }
  }
}
</script>

<style>
</style>
