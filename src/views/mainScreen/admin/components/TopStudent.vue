<template>
  <div>
    <h1>学生入馆次数top</h1>
    <!-- <p>{{ msg }}</p> -->
    <div class="bar_compon">
      <div :id="id" style="min-width:350px;min-height: 400px;" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  DatasetComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components'
import {
  BarChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import { getTopStudent } from '@/api/user'
import { time } from 'echarts/core'
echarts.use(
  [DatasetComponent, GridComponent, VisualMapComponent, BarChart, CanvasRenderer]
)
export default {
  name: 'BookTop',
  props: {
    id: {
      type: String,
      default: 'BookStudent'
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
      getTopStudent().then(respone => {
        var dat = []
        var arr = respone.data.results
        // console.log(arr)
        var timestep = 0
        var top = 0
        arr.forEach(person => {
          var total_sec = person.time
          // var total_sec = 3600 + Math.random() * 600 * (8 - timestep)
          if (timestep == 0) {
            top = total_sec
          }
          var score = total_sec / top
          dat.unshift(
            [total_sec, total_sec, person.name]
          )
          timestep++
        })
        dat.unshift(['score', 'time', 'name'])
        var option = {
          dataset: {
            source: dat
            // [
            //   ['score', 'time', 'name'],
            //   [89.3, 58212, 'Matcha Latte'],
            //   [57.1, 78254, 'Milk Tea'],
            //   [74.4, 41032, 'Cheese Cocoa'],
            //   [50.1, 12755, 'Cheese Brownie'],
            //   [89.7, 20145, 'Matcha Cocoa'],
            //   [68.1, 79146, 'Tea'],
            //   [19.6, 91852, 'Orange Juice'],
            //   [10.6, 101852, 'Lemon Juice'],
            //   [32.7, 20112, 'Walnut Brownie']
            // ]
          },
          grid: { containLabel: true },
          xAxis: { name: 'time' },
          yAxis: { type: 'category', name: 'name' },
          visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 0,
            max: top,
            text: ['More Time', 'Less Time'],
            // Map the score column to color
            dimension: 0,
            inRange: {
              color: ['#65B581', '#FFCE34', '#FD665F']
            }
          },
          series: [
            {
              type: 'bar',
              encode: {
                // Map the "amount" column to X axis.
                x: 'time',
                // Map the "product" column to Y axis
                y: 'name'
              }
            }
          ]
        }
        this.myChart.setOption(option)
      })

    }
  }
}
</script>

<style>
</style>
