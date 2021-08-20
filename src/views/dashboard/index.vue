<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
    <div>
      <div style="margin-top: 20px">
        <h1 style="margin: 30px 20px 30px 70px;">为您推荐：</h1>
        <swiper class="swiper" :options="swiperOption">
          <swiper-slide v-for="(item, index) in recBook" :key="index">
            <div style="height: 380px">
              <img
                :src="base_url + item.pic"
                alt="暂无推荐"
                style="width: 100%; height: 100%"
                @click="dialogVisible=true; currentBook=index"
              >
            </div>
          </swiper-slide>
          <div slot="button-prev" class="swiper-button-prev" />
          <div slot="button-next" class="swiper-button-next" />
          <div slot="pagination" class="swiper-pagination" />
        </swiper>
      </div>
    </div>
    <el-dialog
      title="图书信息"
      :visible.sync="dialogVisible"
      width="30%"
      style="text-align: center"
    >
      <h4 v-if="recBook[currentBook] !== undefined">标题：{{ recBook[currentBook].title }}</h4>
      <h4 v-if="recBook[currentBook] !== undefined">作者：{{ recBook[currentBook].author }}</h4>
      <h4 v-if="recBook[currentBook] !== undefined">类别：{{ recBook[currentBook].category }}</h4>
      <h4 v-if="recBook[currentBook] !== undefined">出版社：{{ recBook[currentBook].press }}</h4>
      <h4 v-if="recBook[currentBook] !== undefined">ISBN：{{ recBook[currentBook].isbn }}</h4>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { generateRecommendBooks, getRecommendBooks } from '@/api/book'
import 'swiper/css/swiper.css'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, Swiper, SwiperSlide },
  data() {
    return {
      currentRole: 'adminDashboard',
      base_url: 'http://124.71.225.17:8000',
      recBook: [],
      dialogVisible: false,
      currentBook: 1,
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 50,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted() {
    this.getRecommentBooks()
  },
  methods: {
    getRecommentBooks() {
      generateRecommendBooks().then(() => {
        const resopnse = getRecommendBooks(this.$store.getters.id)
        return resopnse
      }).then(response => {
        console.log('response')
        console.log(response.data.res)
        this.recBook = response.data.res
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.swiper {
  height: 450px;
  width: 100%;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    //font-size: $font-size-huge * 2;
    background-color: #e3e3e3;
  }
}
.swiper-slide {
  width: 60%;
}
.swiper-slide:nth-child(2n) {
  width: 40%;
}
.swiper-slide:nth-child(3n) {
  width: 20%;
}
</style>
