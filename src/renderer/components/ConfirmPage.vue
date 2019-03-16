<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <div class="title">local: {{localFile}}</div>
    <input id="input"
           value=""
           @keydown="handleKeyDown" />

    <div class="image-item">
      <img v-bind:src="imgUrl"
           alt="上海鲜花港 - 郁金香" />
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
    imgUrl: function () {
      return this.$store.state.ConfirmPage.imgUrl
    },
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
      var key = event.key
      if (key === 'Enter') {
        var value = event.target.value
        console.log('Handle enter key' + value)
        // const fsPromises = this.$electron.require('fs').promises

        var { remote } = require('electron')

        var path = require('path')
        var ext = path.extname(this.localFile)

        var electronFs = remote.require('fs')
        console.log('local file ' + this.localFile)
        var newFile = '/Users/zhanguiqi/Dropbox/Personal/Emoticon/' + value + ext
        electronFs.copyFile(this.localFile, newFile, (err) => {
          if (err) throw err
          console.log('source.txt was copied to destination.txt')
        })

        const storage = require('electron-json-storage')
        storage.setDataPath('/Users/zhanguiqi/Dropbox/Personal/Emoticon/data')
        storage.set(value, { file: newFile }, function (error) {
          if (error) throw error
        })
        //   electronFs.fsPromises.copyFile(this.localFile, '/tmp/ok')
        //     .then(() => console.log('source.txt was copied to destination.txt'))
        //     .catch(() => console.log('The file could not be copied'))
        // }
      }
    },
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
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
