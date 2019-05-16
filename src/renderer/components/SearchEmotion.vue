<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <!-- <div class="title">local: {{localFile}}</div> -->
    <input id="input"
           value=""
           @keydown="handleKeyDown"
           v-on:input="handleChange"
           placeholder="搜索表情..." />
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
import fileutil from '../util/file.js'
export default {
  name: 'confirm-page',
  mounted () {
    console.log('mounted confirm page')
  },
  beforeUpdate () {
    console.log('before update confirm page')
  },
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
    }
  },
  methods: {
    handleChange: function (event) {
      const value = event.target.value
      console.log('Handle  change value' + value)
      const storage = require('electron-json-storage')
      const dataPath = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/data'
      const el = this
      const testFolder = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/'
      const rowCount = this.rowCount
      const itemHeight = this.itemHeight
      const inputHeight = this.inputHeight
      const windowWidth = this.windowWidth

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
                  imgFile: 'file://' + testFolder + filename,
                  filePath: testFolder + filename
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
    selectImage: function (value, obj) {
      const storage = require('electron-json-storage')
      const dataPath = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/data'
      // const path = require('path')

      const electron = this.$electron
      const vue = this

      storage.setDataPath(dataPath)

      const str = JSON.stringify(obj, null, 4)
      if (obj.imgFile.startsWith('http')) {
        console.log('image' + str)
        var fs = require('fs')
        var request = require('request')
        var download = function (uri, filename, callback) {
          request.head(uri, function (err, res, body) {
            if (err) throw err
            console.log('content-type:', res.headers['content-type'])
            console.log('content-length:', res.headers['content-length'])
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
          })
        }

        const tmpFile = '/tmp/tmp.png'
        download(obj.imgFile, tmpFile, function () {
          console.log('tmp img saved')
          // var dataObj = { url: obj.imgFile }
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
                var crypto = require('crypto')
                const md5 = function (text) {
                  return crypto.createHash('md5').update(text).digest('hex')
                }
                var ocr = pinyinStr + '-' + words
                var imgId = md5(ocr)
                var filename = imgId + '.png'
                var localFile = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/' + filename

                download(obj.imgFile, localFile, function () {
                  console.log('done')
                  // const image = electron.nativeImage.createFromPath(localFile)
                  // console.log('filepath ' + localFile)
                  // electron.clipboard.writeImage(image)
                })
                var storeValue = { text: ocr,
                  searched: [value],
                  utime: Date.now(),
                  filename:
                    filename }

                storage.set(imgId, storeValue, function (error) {
                  if (error) throw error
                })
              }
              console.log('imgfile ' + obj.imgFile)
              console.log(response)
            })
            .catch(function (error) {
              console.log(error)
            })
          electron.clipboard.writeImage(img)
          vue.pasteImageToInput()
        })
      } else {
        var filePath = obj.filePath
        console.log('obj ' + filePath)
        var fileType = fileutil.getFileType(filePath)
        var ext = fileType.ext
        console.log('fileType' + fileType.ext)

        // var ext = path.extname(obj.imgFile)
        if (ext === '.gif') {
          this.$electron.clipboard.writeBuffer(
            'NSFilenamesPboardType',
            Buffer.from(`
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
      <array>
        <string>` + this.filePath + `</string>
      </array>
    </plist>
  `)
          )
        } else {
          const e = this.$electron
          // const filepath = testFolder + obj.filename
          const filepath = obj.imgFile.replace('file://', '')
          const image = this.$electron.nativeImage.createFromPath(filepath)
          console.log('filepath ' + filepath)
          e.clipboard.writeImage(image)
        }

        console.log('copy file ' + ext)
        vue.pasteImageToInput()
      }
    },
    handleKeyDown: function (event) {
      console.log('oooo')
      // this.$store.dispatch('ConfirmPage/changeImgUrl', { imgUrl: 'inputed' })
      console.log(event.key)
      const key = event.key
      const value = event.target.value
      console.log('Handle enter key' + value)
      const storage = require('electron-json-storage')
      const dataPath = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/data'
      const el = this
      const rowCount = this.rowCount
      const itemHeight = this.itemHeight
      const inputHeight = this.inputHeight
      const windowWidth = this.windowWidth

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

      if (event.metaKey && key === 'g') {
        console.log('local no Pictures')
        const axios = require('axios')
        const queryUrl = 'https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=' +
          '&sf=1&fmq=1556729374609_R&pv=&ic=&nc=1&z=&hd=&latest=&copyright=&se=1&showtab=0&fb=0&width=&height=&face=0' +
          '&istype=2&ie=utf-8&ctd=1556729374611%5E00_617X698&sid=&word=' + value + ' 表情包'
        // sougou 'https://pic.sogou.com/pics?query=' + value + ' 表情包&di=2&_asf=pic.sogou.com&w=05009900&sut=9393&sst0=1556705686429'

        axios.get(queryUrl)
          .then(function (response) {
            const patt = /"thumbURL":"(.+?)"/g
            var r = patt.exec(response.data)
            var i = 0
            var images = []
            var imageIndex = 0
            var itemIndex = 0
            const imageItems = []

            imageItems[itemIndex] = images
            while (r) {
              if (i % rowCount === 0 && i > 0) {
                images = []
                imageIndex = 0
                imageItems[++itemIndex] = images
              }
              images[imageIndex++] = { imgFile: r[1], filePath: '' }
              console.log('image url ' + r[1])
              i++
              if (i >= rowCount * 2) break
              r = patt.exec(response.data)
            }
            el.imageTable = imageItems
            el.$electron.ipcRenderer.send('resize', windowWidth, inputHeight + imageItems.length * itemHeight)
            console.log(imageItems)
          })
          .catch(function (error) {
            console.log(error)
          })
      } else if (key.length === 1) {
      }
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
      inputHeight: 50,
      windowWidth: 600,
      itemHeight: 215
    }
  }
}
</script>

<style scoped>
.item .value {
  color: #35495e;
  font-weight: bold;
}

.image-item {
  display: inline;
  margin: 3px;
}
#input {
  width: 600px;
  height: 50px;
  font-size: 22px;
  border: none;
  padding-left: 12px;
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
