const state = {
  imgUrl: 'https://aliook'
}

const mutations = {
  CHANGE_IMG_URL (state, payload) {
    console.log('mutations log')
    state.imgUrl = 'ok'
  }
}

const actions = {
  changeImgUrl ({ commit }, payload) {
    // do something async
    console.log('aaaaa')
    commit('CHANGE_IMG_URL', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
