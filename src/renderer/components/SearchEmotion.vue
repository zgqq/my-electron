<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <div class="title">local: {{localFile}}</div>
    <input id="input"
           value=""
           @keydown="handleKeyDown" />

    <div class="image-item">
      <img v-bind:src="imgFile"
           alt="哈哈哈" />
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
          e.clipboard.writeImage(e.nativeImage.createFromPath(this.filePath))
        }

        console.log('copy file')
      }

      storage.keys(function (error, keys) {
        if (error) throw error
        // var FuzzyMatching = require('fuzzy-matching')
        // var fm = new FuzzyMatching(keys)
        // var matched = fm.get(value)

        // console.log(matched)
        // console.log(el)
        // el.imgFile = matched.value
        var fuzzy = require('fuzzy')
        var results = fuzzy.filter(value, keys)
        var matches = results.map(function (el) { return el.string })
        console.log(matches)
        if (matches.length > 0) {
          // do something
          storage.get(matches[0], function (error, data) {
            if (error) throw error
            console.log(data)
            el.imgFile = 'file://' + data.file
            el.filePath = data.file
          })
        } else {
          el.imgFile = ''
        }
      })
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
      imgFile: 'file:///Users/zhanguiqi/Dropbox/Personal/Emoticon/haohao.gif'
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
</style>
