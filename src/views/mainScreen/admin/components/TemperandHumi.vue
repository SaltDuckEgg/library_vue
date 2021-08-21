<template>
  <div>
    <h1>温湿度</h1>
    <div :id="id" style="min-width:800px;min-height: 400px;" />
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import {
  LineChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]
)
import Stomp from 'stompjs'
import { MQ_SERVICE, MQ_USERNAME, MQ_PASSWORD } from '@/config/linkparam.js'
export default {
  name: 'TemperandHumi',
  props: {
    id: {
      type: String,
      default: 'TemperandHumi'
    }
  },
  data() {
    return {

      client: Stomp.client(MQ_SERVICE),
      values: {
        time: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周二', '周三', '周四'],
        temper: [25, 35, 25, 35, 25, 35, 25, 25, 35, 25],
        humi: [40, 50, 40, 50, 40, 50, 40, 40, 50, 40]
      },
      option: {
        color: ['#FFBF00', '#00DDFF'],
        title: {
          // text: '渐变堆叠面积图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['温度', '湿度']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          // x: 25,
          // y: 25,
          // x2: 45,
          // y2: 45,
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周二', '周三', '周四']
            // data: this.values.time
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: Math.max(this.temper, this.humi) + 10
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 3
            },
            showSymbol: true,

            areaStyle: {
              opacity: 0.3,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 191, 0)'
              }, {
                offset: 1,
                color: 'rgba(224, 62, 76)'
              }])
            },

            emphasis: {
              focus: 'series'
            },
            label: {
              show: true,
              position: 'top'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

          },
          {
            name: '湿度',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 3
            },
            // showSymbol: true,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(128, 0, 165)'
              }, {
                offset: 1,
                color: 'rgba(1, 191, 236)'
              }])
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      }
    }
  },
  created() {
    this.connect()
  },
  mounted() {
    this.Draw()
  },
  methods: {
    Draw: function () {
      this.chartDom = document.getElementById(this.id)
      this.myChart = echarts.init(this.chartDom)
      this.myChart.setOption(this.option)
    },
    onConnected: function (frame) {
      console.log('Connected: ' + frame)
      var topic = '/topic/TemperandHumi'

      this.client.subscribe(topic, this.responseCallback, this.onFailed)
    },
    onFailed: function (frame) {
      console.log('Failed: ' + frame)
    },
    responseCallback: function (frame) {
      console.log('responseCallback msg=>' + frame.body)
      // console.log('------')
      var obj = JSON.parse(frame.body)
      var time = 'default'
      var temper = 0
      var humi = 0

      console.log(obj)
      try {
        time = obj.time.substr(-8, 8)
        temper = Number(obj.data[0])
        humi = Number(obj.data[1])
      }
      catch (e) {
        console.log(e)
      }
      this.values.time.shift()
      this.values.time.push(time)
      this.values.temper.shift()
      this.values.temper.push(temper)
      this.values.humi.shift()
      this.values.humi.push(humi)
      this.option.series[0].data = this.values.temper
      this.option.series[1].data = this.values.humi
      this.option.xAxis[0].data = this.values.time
      this.Draw()
    },
    connect: function () {
      var headers = {
        'login': MQ_USERNAME,
        'passcode': MQ_PASSWORD
      }
      this.client.connect(headers, this.onConnected, this.onFailed)
    }
  }
}
</script>
