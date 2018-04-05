import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import createdPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [createdPersistedState()],
  strict: process.env.NODE_ENV !== 'production'
})
