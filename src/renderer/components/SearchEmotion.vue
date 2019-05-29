<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <!-- <div class="title">local: {{localFile}}</div> -->
    <!-- <input id="input"
           value=""
           @keydown="handleKeyDown"
           v-on:input="handleChange"
           placeholder="搜索表情..." /> -->
    <search-bar @keydown="handleKeyDown"
                @input="handleChange"
                :placeholder="placeholder"
                v-bind:help-table="helpTable" />
    <div v-for="(items, index) in imageTable"
         :key="index"
         class="image-list">
      <div v-for="(item, index2) in items"
           :key="index2"
           class="image-item">
        <img v-bind:src="item.imgFile"
             height="190"
             width="190" />
      </div>
    </div>
  </div>
</template>

<script>
import { fileUtil, crypto, stringUtil } from '../util'
import { imageService } from '../service/searcher.js'
import SearchBar from './SearchBar'
export default {
  name: 'SearchEmotion',
  created () {
    setInterval(() => {
      console.log('interval')
    }, 1000)
  },
  mounted () {
    this.appService.resize(this.searchWindow.width, this.searchWindow.height)
  },
  beforeUpdate () {
    console.log('before update confirm page')
  },
  components: { SearchBar },
  updated () {
    console.log('updated confirm')
  },
  beforeRouteEnter (to, from, next) {
    console.log('entered')
    next(vm => {
      // vm.$store.dispatch('ConfirmPage/changeImgUrl', { imgUrl: 'https://baidu.com' })
    })
  },
  computed: {
    main: function () {
      return this.$store.state.Counter.main
    },
    localFile: function () {
      return this.$store.state.ConfirmPage.localFile
    },
    dataDir: function () {
      return this.appConfig.userData + '/emotion'
    },
    cacheDir: function () {
      return this.appConfig.userData + '/emotion/data'
    }
  },
  methods: {
    handleChange: function (e) {
      const event = e.event
      const value = event.target.value
      console.log('Handle  change value' + value)
      const storage = require('electron-json-storage')
      const dataPath = this.cacheDir
      const el = this
      const testFolder = this.dataDir
      const rowCount = this.rowCount
      const itemHeight = this.itemHeight
      // const inputHeight = this.inputHeight
      // const windowWidth = this.windowWidth
      const inputHeight = this.searchWindow.height
      const windowWidth = this.searchWindow.width

      storage.setDataPath(dataPath)
      storage.getAll(function (error, data) {
        if (error) throw error
        var fuzzy = require('fuzzy')
        var prepareMatchs = []
        var i = 0
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const obj = data[key]
            prepareMatchs[i++] = key + obj.text + obj.searched.join()
          }
        }

        var results = []
        if (value !== '') {
          results = fuzzy.filter(value, prepareMatchs)
        }
        var matches = results.map(function (el) { return el.string })
        console.log('matched ' + matches)
        if (matches.length > 0) {
          // do something

          var keys = []
          for (let index = 0; index < matches.length; index++) {
            const file = matches[index]
            keys[index] = file.substring(0, 32)
          }

          storage.getMany(keys, function (error, data) {
            if (error) throw error

            var images = []
            var imageIndex = 0
            var itemIndex = 0
            const imageItems = []

            imageItems[itemIndex] = images
            var index = 0
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const obj = data[key]

                if (index % rowCount === 0 && index > 0) {
                  images = []
                  imageIndex = 0
                  imageItems[++itemIndex] = images
                }
                const filename = obj.filename
                images[imageIndex++] = {
                  imgFile: 'file://' + testFolder + '/' + filename,
                  filePath: testFolder + '/' + filename
                }
              }
              index++
              if (index >= rowCount * 2) {
                break
              }
            }

            el.imageTable = imageItems
            console.log('resize')
            el.$electron.ipcRenderer.send('resize', windowWidth, inputHeight + imageItems.length * itemHeight)
            console.log('imageitem' + imageItems)
          })

          // storage.get(matches[0], function (error, data) {
          //   if (error) throw error
          //   console.log(data)
          //   el.imgFile = 'file://' + data.file
          //   el.filePath = data.file
          // })
        } else {
          el.imageTable = []
          el.$electron.ipcRenderer.send('resize', windowWidth, inputHeight)
        }

        console.log(data)
      })
    },
    pasteImageToInput: function () {
      console.log('robot js')
      // Type "Hello World" then press enter.
      const robot = require('robotjs')
      this.$electron.ipcRenderer.send('hide-app')

      // Type "Hello World".
      // robot.typeString('Hello World')
      // const app = this.$electron.app
      // app.hide()
      // this.$electron.Menu.sendActionToFirstResponder('hide:')
      // this.$electron.remote.getCurrentWindow().hide()
      // Press enter.
      // robot.keyTap('h', 'command')
      var delayInMilliseconds = 50 // 1 second

      setTimeout(function () {
        // your code to be executed after 1 second
        robot.keyTap('v', 'command')
      }, delayInMilliseconds)
    },
    saveImage: function (imgId, imgFile, localFile, ocr, value, filename) {
      const storage = require('electron-json-storage')
      const dataPath = this.dataDir + '/data'
      storage.setDataPath(dataPath)
      fileUtil.downloadImage(imgFile, localFile, function () {
        console.log('done')
      })
      let searchedValue = [value]
      let pinyin = stringUtil.toPinyinString(value)
      if (pinyin !== value) {
        searchedValue[1] = pinyin
      }
      var storeValue = { text: ocr,
        searched: searchedValue,
        utime: Date.now(),
        filename:
          filename }

      storage.set(imgId, storeValue, function (error) {
        if (error) throw error
      })
    },
    selectImage: function (value, obj) {
      // const path = require('path')

      const electron = this.$electron
      const vue = this
      const str = JSON.stringify(obj, null, 4)
      const dataDir = this.dataDir

      if (obj.imgFile.startsWith('http')) {
        console.log('image' + str)
        const tmpFile = '/tmp/tmp.png'
        fileUtil.downloadImage(obj.imgFile, tmpFile, () => {
          console.log('tmp img saved')
          // var dataObj = { url: obj.imgFile }
          if (fileUtil.isGif(tmpFile)) {
            var ocr = ''
            var imgId = crypto.md5(value)
            var filename = imgId + '.gif'
            var localFile = dataDir + '/' + filename
            vue.saveImage(imgId, obj.imgFile, localFile, ocr, value, filename)
          } else {
            const img = electron.nativeImage.createFromPath(tmpFile)
            console.log(img.toDataURL())
            const imageData = img.toDataURL().replace(/^data:([A-Za-z-+/]+);base64,/, '')

            console.log('imageObj' + img)
            // console.log('imageData' + imageData)
            var dataObj = { image: imageData }

            const axios = require('axios')
            const querystring = require('querystring')
            axios.post('https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=24.5981c80f9e65ad0886b5acff6cd87f67.2592000.1558855207.282335-16118581',
              querystring.stringify(dataObj)
            )
              .then(function (response) {
                const pinyin = require('pinyin')
                console.log(pinyin('中心,,,_ 为', {
                  style: pinyin.STYLE_NORMAL
                }))
                const result = response.data.words_result
                if (result !== undefined && result.length > 0) {
                  // array empty or does not exist
                  var pinyinStr = ''
                  var words = ''
                  for (let index = 0; index < result.length; index++) {
                    const line = result[index]
                    const word = line.words.replace(/[ |,]+/, '_')
                    const pinyins = pinyin(word, {
                      style: pinyin.STYLE_NORMAL
                    })
                    words += word
                    for (var i = 0; i < pinyins.length; i++) {
                      const element = pinyins[i]
                      pinyinStr += element
                      if (i !== pinyins.length - 1) {
                        pinyinStr += '_'
                      }
                    }
                  }

                  console.log('pinyinStr:' + pinyinStr)
                  var ocr = pinyinStr + '-' + words
                  var imgId = crypto.md5(ocr)
                  var filename = imgId + '.png'
                  var localFile = dataDir + '/' + filename
                  vue.saveImage(imgId, obj.imgFile, localFile, ocr, value, filename)
                }
                console.log('imgfile ' + obj.imgFile)
                console.log(response)
              })

              .catch(function (error) {
                console.log(error)
              })
          }
          // electron.clipboard.writeImage(img)
          this.clipboardService.writeImage(tmpFile)
          vue.pasteImageToInput()
        })
      } else {
        var filePath = obj.filePath
        this.clipboardService.writeImage(filePath)
        console.log('obj ' + filePath)
        // console.log('copy file ' + ext)
        vue.pasteImageToInput()
      }
    },
    handleKeyDown: function (e) {
      const event = e.event
      console.log('oooo')
      // this.$store.dispatch('ConfirmPage/changeImgUrl', { imgUrl: 'inputed' })
      console.log(event.key)
      const key = event.key
      const value = event.target.value
      console.log('Handle enter key' + value)
      const storage = require('electron-json-storage')
      const dataPath = this.cacheDir
      const rowCount = this.rowCount
      const itemHeight = this.itemHeight
      // const inputHeight = this.inputHeight
      // const windowWidth = this.windowWidth
      const inputHeight = this.searchWindow.height
      const windowWidth = this.searchWindow.width

      storage.setDataPath(dataPath)
      if (key === 'Enter') {
        var obj = this.imageTable[0][0]
        this.selectImage(value, obj)
        //       var ext = path.extname(this.filePath)
        //       if (ext === '.gif') {
        //         this.$electron.clipboard.writeBuffer(
        //           'NSFilenamesPboardType',
        //           Buffer.from(`
        //   <?xml version="1.0" encoding="UTF-8"?>
        //   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        //   <plist version="1.0">
        //     <array>
        //       <string>` + this.filePath + `</string>
        //     </array>
        //   </plist>
        // `)
        //         )
        //       } else {
        //         const e = this.$electron
        //         const image = this.$electron.nativeImage.createFromPath(this.filePath).resize({ witdh: 120, height: 120 }, 'best')
        //         e.clipboard.writeImage(image)
        //       }

        console.log('copy file')
      }

      const numKey = (parseInt(key) || -1)
      if (event.metaKey && numKey >= 0 && numKey <= 9) {
        // (numKey / rowCount)
        console.log('select image')
        var quotient = Math.floor((numKey - 1) / rowCount)
        var remainder = (numKey - 1) % rowCount
        var selectedImage = this.imageTable[quotient][remainder]
        this.selectImage(value, selectedImage)
        return
      }

      if (key === 'Escape') {
        console.log('esc')
        this.appService.hideApp()
      }

      let search = false
      let type = ''
      if (event.metaKey && key === 'g') {
        search = true
        type = 'sogou'
      } else if (event.metaKey && key === 'b') {
        search = true
        type = 'baidu'
      }
      if (search) {
        imageService.search(value, (imageItems) => {
          console.log('table' + imageItems.length)
          this.imageTable = imageItems
          this.$electron.ipcRenderer.send('resize', windowWidth, inputHeight + imageItems.length * itemHeight)
        }, type)
      }

      // let search = false
      // let queryUrl
      // let patt

      // if (event.metaKey && key === 'g') {
      //   queryUrl = 'https://pic.sogou.com/pics?query=' + value + ' 表情包&di=2&_asf=pic.sogou.com&w=05009900&sut=9393&sst0=1556705686429'
      //   patt = /"thumbUrl":"(.+?)"/g
      //   search = true
      // } else if (event.metaKey && key === 'b') {
      //   queryUrl = 'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=' +
      //     '&sf=1&fmq=1556729374609_R&pv=&ic=&nc=1&z=&hd=&latest=&copyright=&se=1&showtab=0&fb=0&width=&height=&face=0' +
      //     '&istype=2&ie=utf-8&ctd=1556729374611%5E00_617X698&sid=&word=' + value + ' 表情包'
      //   patt = /"thumbURL":"(.+?)"/g
      //   search = true
      // }

      // if (search) {
      //   console.log('local no Pictures')
      //   const axios = require('axios')

      //   axios.get(queryUrl)
      //     .then(function (response) {
      //       var r = patt.exec(response.data)
      //       var i = 0
      //       var images = []
      //       var imageIndex = 0
      //       var itemIndex = 0
      //       const imageItems = []

      //       imageItems[itemIndex] = images
      //       while (r) {
      //         if (i % rowCount === 0 && i > 0) {
      //           images = []
      //           imageIndex = 0
      //           imageItems[++itemIndex] = images
      //         }
      //         images[imageIndex++] = { imgFile: r[1], filePath: '' }
      //         console.log('image url ' + r[1])
      //         i++
      //         if (i >= rowCount * 2) break
      //         r = patt.exec(response.data)
      //       }
      //       el.imageTable = imageItems
      //       el.$electron.ipcRenderer.send('resize', windowWidth, inputHeight + imageItems.length * itemHeight)
      //       console.log(imageItems)
      //     })
      //     .catch(function (error) {
      //       console.log(error)
      //     })
      // } else if (key.length === 1) {

      // }
      // const fs = require('fs')
      // fs.readdir(testFolder, (err, files) => {
      //   if (err) throw err
      //   files.forEach(file => {
      //     console.log(file)
      //   })
      //   const keys = files
      //   var fuzzy = require('fuzzy')
      //   var results = fuzzy.filter(value, keys)
      //   var matches = results.map(function (el) { return el.string })
      //   console.log(matches)
      //   if (matches.length > 0) {
      //     // do something
      //     // storage.get(matches[0], function (error, data) {
      //     //   if (error) throw error
      //     // console.log(data)

      //     var images = []
      //     var imageIndex = 0
      //     var itemIndex = 0
      //     const imageItems = []

      //     imageItems[itemIndex] = images
      //     for (let index = 0; index < matches.length; index++) {
      //       if (index % rowCount === 0 && index > 0) {
      //         images = []
      //         imageIndex = 0
      //         imageItems[++itemIndex] = images
      //       }
      //       const file = matches[index]
      //       // el.imgFile = 'file://' + testFolder + file
      //       // el.filePath = file
      //       images[imageIndex++] = {
      //         imgFile: 'file://' + testFolder + file,
      //         filePath: file
      //       }
      //     }
      //     el.imageTable = imageItems
      //     console.log(imageItems)
      //     // const file = matches[0]
      //     // })
      //   } else {

      //   }
      // })

      // console.log('kkkkkkk')
      // console.log('this electron' + this.$electron)
      // this.imgFile = 'file:///Users/zhanguiqi/Pictures/9f0d61159534abb6b39068b13edf8a29.gif'
      //   electronFs.fsPromises.copyFile(this.localFile, '/tmp/ok')
      //     .then(() => console.log('source.txt was copied to destination.txt'))
      //     .catch(() => console.log('The file could not be copied'))
      // }
    }
  },
  data () {
    return {
      imgFile: 'file:///Users/zhanguiqi/Dropbox/Personal/Emoticon/haohao.gif',
      imageTable: [],
      rowCount: 3,
      // inputHeight: this.searchWindow.height,
      // windowWidth: this.searchWindow.width,
      itemHeight: 210,
      // dataDir: '/Users/zhanguiqi/Dropbox/Images/personal/emotion',
      placeholder: '搜索表情',
      helpTable: [['cmd+1选择第一张', 'cmd+2选择第二张']]
    }
  }
}
</script>

<style scoped>
.image-item {
  display: inline;
  margin: 3px;
}

.image-list {
  margin: 3px;
  margin-top: 0px;
}

::placeholder {
  color: #bdc0c3;
  font-size: 24px;
}

textarea:focus,
input:focus {
  outline: none;
}
</style>
