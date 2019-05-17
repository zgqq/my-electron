/* eslint-disable */
<template>
  <search-bar :placeholder="placeholder" />
</template>

<script>
import SearchBar from './SearchBar'

export default {
  name: 'HomePage',
  components: { SearchBar },
  data () {
    return {
      placeholder: 'Hello!'
    }
  },
  mounted () {
  },
  // components: { SystemInformation ,
  methods: {
  }
}
</script>

