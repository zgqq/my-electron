<template>
  <div>
    <!-- <div class="title">Information</div> -->
    <div class="title">{{imgUrl}}1{{main}}</div>
    <input id="input"
           value=""
           @keydown="handleKeyDown" />

  </div>
</template>

<script>
export default {
  name: 'confirm-page',
  mounted () {
    console.log('mounted confirm page')
    this.$store.dispatch('ConfirmPage/changeImgUrl',
      { imgUrl: 'https://baidu.com' })
  },
  beforeUpdate () {
    console.log('before update confirm page')
  },
  beforeRouteEnter (to, from, next) {
    console.log('entered')
    next(vm => {
      vm.$store.dispatch('changeImgUrl', { imgUrl: 'https://baidu.com' })
    })
  },
  computed: {
    imgUrl: function () {
      return this.$store.state.ConfirmPage.imgUrl
    },
    main: function () {
      return this.$store.state.Counter.main
    }
  },
  methods: {
    handleKeyDown: function () {
      console.log('oooo')
      this.$store.dispatch('changeImgUrlsssss')
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
