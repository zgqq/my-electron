const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  add ({ commit }) {
    // do something async
    console.log('aaaa')
    commit('INCREMENT_MAIN_COUNTER')
  },
  nice ({ commit }) {
    console.log('nice')
  }
}

export default {
  state,
  mutations,
  actions
}
