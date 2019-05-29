/* eslint-disable */
<template>
  <div>
    <div v-for="(item, index) in list"
         :key="index"
         class="">
    </div>
  </div>
</template>

<script>

export default {
  name: 'StockPage',
  data () {
    return {
      placeholder: 'Hello!'
    }
  },
  mounted () {
    setInterval(() => {

    }, 10000)
  },
  methods: {
  }
}
</script>

