const state = {
  helpTable: [['bangbang'], ['bangbang']]
}

const mutations = {
  CHANGE_HELP_TABLE (state, payload) {
    console.log('mutations log')
    state.helpTable = payload
  }
}

const actions = {
  changeHelpTable ({ commit }, payload) {
    // do something async
    console.log('aaaaa')
    commit('CHANGE_HELP_TABLE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
