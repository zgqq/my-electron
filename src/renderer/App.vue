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

      this.$electron.ipcRenderer.on('synchronous-message', (event, args) => {
        console.log('recevie' + args)
        this.$router.push('confirm')
        // this.$router.push({ name: 'confirm-page', params: { : '123' }})
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
