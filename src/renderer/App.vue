<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-electron',
  created () {
    console.log('created app')
    const channel = 'synchronous-message'
    this.$electron.ipcRenderer.removeAllListeners(channel)
    this.$electron.ipcRenderer.on(channel, (event, args) => {
      if (args === 'confirm') {
        console.log('recevie  ' + args)
        // this.$store.commit('CHANGE_IMG_URL')
        var filePath = this.$electron.clipboard.read('public.file-url')
        var localFile = filePath.replace('file://', '')
        if (localFile !== '') {
          var path = require('path')
          console.log('file ' + localFile)
          var ext = path.extname(localFile)
          if (ext !== 'gif') {
            console.log('not gif')
          } else {
            console.log('lt is a gif file')
          }
        } else {
          const image = this.$electron.clipboard.readImage()
          const imageData = image.toDataURL().replace(/^data:([A-Za-z-+/]+);base64,/, '')
          // console.log('imageData:' + imageData)
          const axios = require('axios')
          const querystring = require('querystring')
          axios.post('https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=24.5981c80f9e65ad0886b5acff6cd87f67.2592000.1558855207.282335-16118581',
            // querystring.stringify({ image: querystring.escape(imageData) }))

            querystring.stringify({ image: imageData }))
            .then(function (response) {
              const pinyin = require('pinyin')
              console.log(pinyin('中心,,,_ 为', {
                style: pinyin.STYLE_NORMAL
              }))
              const result = response.data.words_result
              if (result !== undefined && result.length > 0) {
                // array empty or does not exist
                const word = result[0].words.replace(/[ |,]+/, '_')
                const pinyins = pinyin(word, {
                  style: pinyin.STYLE_NORMAL
                })
                var pinyinStr = ''
                for (var i = 0; i < pinyins.length; i++) {
                  const element = pinyins[i]
                  pinyinStr += element
                  if (i !== pinyins.length - 1) {
                    pinyinStr += '_'
                  }
                }

                console.log('pinyinStr:' + pinyinStr)
              }
              console.log(response)
            })
            .catch(function (error) {
              console.log(error)
            })
        }
        this.$store.dispatch('ConfirmPage/changeImgUrl', { imgUrl: filePath, localFile: localFile })
        this.$router.push('confirm')
        event.sender.send('page-loaded', 'ok')
        // this.$electron.ipcRenderer.sendSync('loaded', 'ping')
        // this.$router.push({ name: 'confirm-page', params: { : '123' }})
      } else if (args === 'search') {
        this.$router.push('search-emotion')
      }
    })
  },
  mounted () {
    var filePath = this.$electron.clipboard.read('public.file-url').replace('file://', '')
    console.log('filePath ' + filePath)
    // this.$store.dispatch('nice')
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
