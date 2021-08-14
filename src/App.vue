<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
}
</script>
