<template>
  <div>
    <input id="input"
           value=""
           @keydown="handleKeydown"
           @input="handleChange"
           :width="searchWindow.width+'px'"
           :height="searchWindow.height+'px'"
           :placeholder="placeholder" />
  </div>
</template>
<script>
export default {
  name: 'SearchBar',
  props: ['placeholder'],
  computed: {
  },
  methods: {
    handleChange: function (event) {
      this.$emit('input', { event: event })
    },
    handleKeydown: function (event) {
      this.$emit('keydown', { event: event })
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
