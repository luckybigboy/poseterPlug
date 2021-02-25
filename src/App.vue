<template>
  <div id="app">
    <span class="label">开始抓取模式：</span>
    <el-switch v-model="isStart"></el-switch>
  </div>
</template>

<script>
import { Switch } from 'element-ui'
import Vue from 'vue'
Vue.use(Switch)
export default {
  name: 'popup',
  data() {
    return {
      isStart: false
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
  display: flex;
  .label {
    display: inline-block;
    width: 100px;
  }
}
</style>
