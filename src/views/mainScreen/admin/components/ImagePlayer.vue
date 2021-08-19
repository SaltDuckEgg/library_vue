<template>
  <div class="demo-image__placeholder">
    <div class="block">
      <h1>楼层示意图:{{cur_floor+1}}L</h1>
      <el-image
        :src="'http://124.71.225.17:8000/media/floor/' + String(cur_floor+1) + 'L.png'"
        @click="oncall"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cur_floor: 0,
      // src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  },
  methods: {
    oncall() {
      this.cur_floor = (this.cur_floor + 1) % 7
    }
  }
}
</script>
