const state = {
  message: '',
  visible: false,
  type: 'info'
}

const mutations = {
  DISPLAY_MESSAGE (state, {message, type}) {
    state.message = message
    state.type = type
    state.visible = true
  },

  CLEAR_MESSAGE (state) {
    state.message = ''
    state.type = 'info'
    state.visible = false
  }
}

const actions = {
  error ({commit}, message) {
    const type = 'error'
    commit('DISPLAY_MESSAGE', {message, type})
  },
  warn ({commit}, message) {
    const type = 'warning'
    commit('DISPLAY_MESSAGE', {message, type})
  },
  info ({commit}, message) {
    const type = 'info'
    commit('DISPLAY_MESSAGE', {message, type})
  },
  success ({commit}, message) {
    const type = 'success'
    commit('DISPLAY_MESSAGE', {message, type})
  },
  clearAlert ({commit}) {
    commit('CLEAR_MESSAGE')
  }
}

export default {
  state, mutations, actions
}
