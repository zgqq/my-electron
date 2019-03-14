<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'my-electron',
    mounted () {
      var filePath = this.$electron.clipboard.read('public.file-url').replace('file://', '')
      console.log('filePath ' + filePath)
      // this.$electron.globalShortcut.register('cmd+option+l', function () {
      //   var filePath = this.$electron.clipboard.read('public.file-url').replace('file://', '')
      //   console.log('filePath ' + filePath)
      // })
      // e.globalShortcut.register('cmd+option+l', function () {
      //   var filePath = this.$electron.clipboard.read('public.file-url').replace('file://', '')
      //   console.log('filePath ' + filePath)
      // })
    }
  }
</script>

<style>
  /* CSS */
</style>
