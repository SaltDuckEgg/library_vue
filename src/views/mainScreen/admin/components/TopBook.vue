<template>
  <div>
    <h1>热书榜</h1>
    <!-- <p>{{ msg }}</p> -->
    <div class="bar_compon">
      <div :id="id" style="min-width:400px;min-height: 500px;" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
  SunburstChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import { getTopBookWeek } from '@/api/book'

echarts.use(
  [SunburstChart, CanvasRenderer]
)
/* 由于全局引入会将所有的echarts图表打包，导致体积过大，所以在本项目中，采用组建的形式按需引入*/
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// // 引入柱状图组件
// require('echarts/lib/chart/bar')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')

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

      var colors = ['#283D3B', '#197278', '#C44536', '#EDDDD4', '#772E25']
      var bgColor = '#FFFFFF'

      var itemStyle = {
        star5: {
          color: colors[0]
        },
        star4: {
          color: colors[1]
        },
        star3: {
          color: colors[2]
        },
        star2: {
          color: colors[3]
        }
      }
      getTopBookWeek().then(response => {
        var res = [
          {
            name: '第一部分',
            itemStyle: { color: '#64B6AC' },
            children: []
          },
          {
            name: '第二部分',
            itemStyle: { color: '#98C9A3' },
            children: []
          }]
        var category_list = []
        response.data.res.forEach(function (item) {
          if (item.bookinfo.category in category_list) {
            category_list[item.bookinfo.category].push({
              title: item.bookinfo.title,
              count: item.count
            })
          } else {
            category_list[item.bookinfo.category] = [{
              title: item.bookinfo.title,
              count: item.count
            }]
          }
        })
        // console.log(category_list)
        const category_num = Object.keys(category_list).length
        var category_idx = -1
        var main_loop = 0
        for (var category in category_list) {
          category_idx++
          if (category_idx <= category_num / 2) {
            main_loop = 0
          } else {
            main_loop = 1
          }
          var temp = []
          for (var idx in category_list[category]) {
            temp.push(
              {
                name: String(category_list[category][idx].count) + '☆',
                children: [
                  {
                    name: category_list[category][idx].title
                  }
                ]
              }
            )
          }

          res[main_loop].children.push(
            {
              name: category,
              children: temp
            }
          )
          // category_list[category].forEach(function (book, idx) {
          //   res[main_loop].children[0].children.push(
          //     {
          //       name: '5☆',
          //       children: [
          //         {
          //           name: book.title
          //         }
          //       ]
          //     }
          //   )
          // })
        }
        var data = res
        // console.log(res)
        for (var j = 0; j < data.length; ++j) {
          var level1 = data[j].children
          for (var i = 0; i < level1.length; ++i) {
            var block = level1[i].children
            var bookScore = []
            var bookScoreId
            for (var star = 0; star < block.length; ++star) {
              var style = (function (name) {
                switch (name) {
                  case '3☆':
                    bookScoreId = 0
                    return itemStyle.star5
                  case '2☆':
                    bookScoreId = 1
                    return itemStyle.star4
                  case '1☆':
                    bookScoreId = 2
                    return itemStyle.star3
                  case '0☆':
                    bookScoreId = 3
                    return itemStyle.star2
                  default:
                    bookScoreId = 0
                    return itemStyle.star5
                }
              })(block[star].name)

              block[star].label = {
                color: style.color,
                downplay: {
                  opacity: 0.5
                }
              }

              if (block[star].children) {
                style = {
                  opacity: 1,
                  color: style.color
                }
                block[star].children.forEach(function (book) {
                  book.value = 1
                  book.itemStyle = style

                  book.label = {
                    color: style.color
                  }

                  var value = 1
                  if (bookScoreId === 0 || bookScoreId === 3) {
                    value = 5
                  }

                  if (bookScore[bookScoreId]) {
                    bookScore[bookScoreId].value += value
                  } else {
                    bookScore[bookScoreId] = {
                      color: colors[bookScoreId],
                      value: value
                    }
                  }
                })
              }
            }

            level1[i].itemStyle = {
              color: data[j].itemStyle.color
            }
          }
        }

        var option = {
          // backgroundColor: bgColor,
          color: colors,
          series: [{
            type: 'sunburst',
            center: ['50%', '50%'],
            data: data,
            sort: function (a, b) {
              if (a.depth === 1) {
                return b.getValue() - a.getValue()
              } else {
                return a.dataIndex - b.dataIndex
              }
            },
            label: {
              rotate: 'radial',
              color: bgColor
            },
            itemStyle: {
              borderColor: bgColor,
              borderWidth: 2
            },
            levels: [{}, {
              r0: 0,
              r: 40,
              label: {
                rotate: 0
              }
            }, {
              r0: 40,
              r: 105
            }, {
              r0: 115,
              r: 140,
              itemStyle: {
                shadowBlur: 2,
                shadowColor: colors[2],
                color: 'transparent'
              },
              label: {
                rotate: 'tangential',
                fontSize: 10,
                color: colors[0]
              }
            }, {
              r0: 140,
              r: 145,
              itemStyle: {
                shadowBlur: 80,
                shadowColor: colors[0]
              },
              label: {
                position: 'outside'
                // textShadowBlur: 5,
                // textShadowColor: '#333'
              },
              downplay: {
                label: {
                  opacity: 0.1
                }
              }
            }]
          }]
        }
        this.myChart.setOption(option)
      })
    }
  }
}
</script>

<style>
</style>
