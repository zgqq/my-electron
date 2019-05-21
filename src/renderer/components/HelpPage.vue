/* eslint-disable */
<template>
  <div>
    <div v-for="(items, index) in helpTable"
         :key="index"
         class="help-list">
      <div v-for="(item, index2) in items"
           :key="index2"
           class="help-item">
        {{item}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpPage',
  data () {
    return {
      // helpTable: [['ok', 'ok']]
    }
  },
  computed: {
    helpTable: function () {
      return this.$store.state.HelpPage.helpTable
    }
  },
  mounted () {
  },
  // components: { SystemInformation ,
  methods: {
  }
}
</script>

<style scoped>
.help-item {
  display: inline;
  margin: 3px;
}

.help-list {
  margin: 3px;
  margin-top: 0px;
}
</style>
