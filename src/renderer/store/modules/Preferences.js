import { createHash } from 'crypto'

const state = {
  hostname: '',
  apiKey: '',
  user: {},
  workingStatus: '',
  pausedStatus: '',
  entrada: '8:00',
  intervalo: '12:00',
  retorno: '14:00',
  saida: '18:00',
  workspaces: '[]',
  gravatarUrl: ''
}

const mutations = {
  SAVE_CONNECTION_INFO (state, payload) {
    state.hostname = payload.hostname
    state.apiKey = payload.apiKey
  },

  SAVE_USER_INFO (state, userinfo) {
    state.user = userinfo
  },

  SAVE_GRAVATAR_URL (state, gravatarUrl) {
    state.gravatarUrl = gravatarUrl
  },

  SAVE_PREFERENCES (state, prefs) {
    state.workingStatus = prefs.workingStatus
    state.pausedStatus = prefs.pausedStatus
    state.entrada = prefs.entrada
    state.intervalo = prefs.intervalo
    state.retorno = prefs.retorno
    state.saida = prefs.saida
    state.workspaces = JSON.stringify(prefs.workspaces)
  }
}

const actions = {
  authenticate ({ commit }, {apiKey, hostname, user}) {
    commit('SAVE_CONNECTION_INFO', {apiKey, hostname})
    commit('SAVE_USER_INFO', user)

    if (user.mail) {
      const md5 = createHash('md5')
      const hash = md5.update(user.mail).digest('hex')
      commit('SAVE_GRAVATAR_URL', `http://www.gravatar.com/avatar/${hash}`)
    }
  },
  savePreferences ({ commit }, prefs) {
    commit('SAVE_PREFERENCES', prefs)
  }
}

const getters = {
  isAuthenticated: state => {
    if (state.user.mail) {
      return true
    } else {
      return false
    }
  },
  userFullName: state => {
    if (state.user.firstname) {
      return `${state.user.firstname} ${state.user.lastname}`
    } else {
      return ''
    }
  },
  workspaceList: state => {
    return JSON.parse(state.workspaces)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
