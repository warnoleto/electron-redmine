const state = {
  entries: {}
}

const mutations = {
  OPEN_ENTRY (state, {issueId, start, date}) {
    if (!state.entries[issueId]) {
      state.entries[issueId] = { entries: [] }
    }
    state.entries[issueId].entries.push({start, date})
  },
  CLOSE_ENTRY (state, {issueId, end, date}) {
    if (!state.entries[issueId]) {
      state.entries[issueId] = { entries: [] }
    }
    let open = state.entries[issueId].entries.filter(e => !e.end && e.date === date)
    if (open) {
      open.end = end
    }
  }

}

const actions = {
  startTracking ({commit}, {issueId, start, date}) {
    commit('OPEN_ENTRY', {issueId, start, date})
  },
  stopTracking ({commit}, {issueId, end, date}) {
    commit('CLOSE_ENTRY', {issueId, end, date})
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
