<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { Message } from 'element-ui'
let sseClient

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    sseClient = this.$sse.create({
      url: 'http://124.71.225.17:8000/events/ '
    })
    console.log('已创建')
    sseClient.on('message', this.showMessage)
    sseClient.connect()
      .then(sse => {
        console.log('已连接到后端SSE！')
      })
      .catch((err) => {
        console.error('无法连接到后端SSE！', err)
      })
    // if (typeof (EventSource) !== 'undefined') {
    //   const source = new EventSource('http://124.71.225.17:8000/user/stream/ ')
    //   console.log('connected!')
    //   source.onmessage = function(event) {
    //     console.log(event.data)
    //   }
    // }
  },
  beforeDestroy() {
    sseClient.disconnect()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    showMessage(message) {
      console.log(message)
      const str = JSON.parse(message)
      const jsonObj = JSON.parse(str)
      const username = jsonObj.username
      console.log(username)
      if (username === this.$store.getters.username || this.$store.getters.roles[0] === 'administrator') {
        const name = this.$store.getters.name
        const inOut = jsonObj.type ? '入馆' : '出馆'
        Message({
          message: username + ' - ' + name + '已' + inOut,
          type: 'success',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
