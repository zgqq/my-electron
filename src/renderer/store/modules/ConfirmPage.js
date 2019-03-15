const state = {
  imgUrl: 'https://ali',
  localFile: ''
}

const mutations = {
  CHANGE_IMG_URL (state, payload) {
    console.log('mutations log')
    state.imgUrl = payload.imgUrl
    state.localFile = payload.localFile
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
  namespaced: true,
  state,
  mutations,
  actions
}
