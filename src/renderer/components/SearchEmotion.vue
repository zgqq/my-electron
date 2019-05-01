<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <div class="title">local: {{localFile}}</div>
    <input id="input"
           value=""
           @keydown="handleKeyDown" />
    <div v-for="(items, index) in imageTable"
         :key="index"
         class="image-list">
      <div v-for="(item, index2) in items"
           :key="index2"
           class="image-item">
        <img v-bind:src="item.imgFile"
             height="190"
             width="190"
             alt="哈哈哈" />
      </div>
    </div>
  </div>
</template>

<script>
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
    handleKeyDown: function (event) {
      console.log('oooo')
      // this.$store.dispatch('ConfirmPage/changeImgUrl', { imgUrl: 'inputed' })
      console.log(event.key)
      const key = event.key
      const value = event.target.value
      console.log('Handle enter key' + value)
      const storage = require('electron-json-storage')
      storage.setDataPath('/Users/zhanguiqi/Dropbox/Personal/Emoticon/data')
      const el = this

      if (key === 'Enter') {
        var path = require('path')
        var ext = path.extname(this.filePath)
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
          const image = this.$electron.nativeImage.createFromPath(this.filePath).resize({ witdh: 120, height: 120 }, 'best')
          e.clipboard.writeImage(image)
        }

        console.log('copy file')
      }
      // storage.keys(function (error, keys) {
      //   if (error) throw error
      //   // var FuzzyMatching = require('fuzzy-matching')
      //   // var fm = new FuzzyMatching(keys)
      //   // var matched = fm.get(value)

      //   // console.log(matched)
      //   // console.log(el)
      //   // el.imgFile = matched.value
      //   var fuzzy = require('fuzzy')
      //   var results = fuzzy.filter(value, keys)
      //   var matches = results.map(function (el) { return el.string })
      //   console.log(matches)
      //   if (matches.length > 0) {
      //     // do something
      //     storage.get(matches[0], function (error, data) {
      //       if (error) throw error
      //       console.log(data)
      //       el.imgFile = 'file://' + data.file
      //       el.filePath = data.file
      //     })
      //   } else {
      //     el.imgFile = ''
      //   }
      // })

      const rowCount = 4
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
              images[imageIndex++] =
                { imgFile: r[1],
                  filePath: '' }
              console.log('image url ' + r[1])
              i++
              if (i >= rowCount * 2) break
              r = patt.exec(response.data)
            }
            el.imageTable = imageItems
            console.log(imageItems)
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        const testFolder = '/Users/zhanguiqi/Dropbox/Images/personal/emotion/'
        const fs = require('fs')
        fs.readdir(testFolder, (err, files) => {
          if (err) throw err
          files.forEach(file => {
            console.log(file)
          })
          const keys = files
          var fuzzy = require('fuzzy')
          var results = fuzzy.filter(value, keys)
          var matches = results.map(function (el) { return el.string })
          console.log(matches)
          if (matches.length > 0) {
            // do something
            // storage.get(matches[0], function (error, data) {
            //   if (error) throw error
            // console.log(data)

            var images = []
            var imageIndex = 0
            var itemIndex = 0
            const imageItems = []

            imageItems[itemIndex] = images
            for (let index = 0; index < matches.length; index++) {
              if (index % rowCount === 0 && index > 0) {
                images = []
                imageIndex = 0
                imageItems[++itemIndex] = images
              }
              const file = matches[index]
              // el.imgFile = 'file://' + testFolder + file
              // el.filePath = file
              images[imageIndex++] = {
                imgFile: 'file://' + testFolder + file,
                filePath: file
              }
            }
            el.imageTable = imageItems
            console.log(imageItems)
            // const file = matches[0]
            // })
          } else {
          }
        })
      }
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
      imageTable: []
    }
  }
}
</script>

<style scoped>
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.items {
  margin-top: 8px;
}

.item {
  display: flex;
  margin-bottom: 6px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}

.image-item {
  display: inline;
}
</style>
