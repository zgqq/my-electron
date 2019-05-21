<template>
  <div id="input_area"
       :width="searchWindow.width+'px'"
       :height="searchWindow.height+'px'">
    <input id="input"
           autofocus
           value=""
           @keydown="handleKeydown"
           @input="handleChange"
           :width="searchWindow.width+'px'"
           :height="searchWindow.height+'px'"
           :placeholder="placeholder" />
  </div>
</template>
<script>
import Help from './mixins/help.js'
export default {
  name: 'SearchBar',
  props: ['placeholder', 'helpTable'],
  mixins: [Help],
  computed: {
  },
  methods: {
    handleChange: function (event) {
      this.$emit('input', { event: event })
    },
    handleKeydown: function (event) {
      if (event.metaKey && event.key === '/') {
        console.log('placeholder' + this.placeholder)
        console.log('helpTable' + this.helpTable)
        this.enterHelp(this.helpTable)
      } else {
        this.$emit('keydown', { event: event })
      }
    }
  },
  data: {
    placeholder: ''
  }
}
</script>

<style scoped>
#input {
  font-size: 22px;
  border: none;
  padding-left: 12px;
  margin-bottom: 8px;
  margin-top: 8px;
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
