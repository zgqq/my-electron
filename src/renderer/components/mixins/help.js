export default {
  methods: {
    enterHelp (helpTable) {
      this.$router.push('help')
      this.$store.dispatch('HelpPage/changeHelpTable', helpTable)
    }
  },
  mounted () {},
  destroyed () {}
}
