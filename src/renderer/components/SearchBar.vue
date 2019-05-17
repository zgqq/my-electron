<template>
  <div>
    <input id="input"
           value=""
           @keydown="handleKeyDown"
           @input="handleChange"
           :placeholder="placeholder" />
  </div>
</template>
<script>
export default {
  name: 'SearchBar',
  props: ['placeholder'],
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
  width: 600px;
  height: 50px;
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
