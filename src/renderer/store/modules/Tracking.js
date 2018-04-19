import moment from 'moment'
const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm'

const entriesOfTheDay = (date, issueId) => e => {
  if (issueId) {
    return e.start && e.date === date && e.issueId === issueId
  } else {
    return e.start && e.date === date
  }
}
const diffHours = (e) => {
  let end = e.end ? moment(e.end, TIME_FORMAT) : moment()
  return end.diff(moment(e.start, TIME_FORMAT), 'hours', true)
}
const sum = (a, b) => a + b

const state = {
  entries: [],
  current: ''
}

const mutations = {
  OPEN_ENTRY (state, {issueId, start, date}) {
    let opens = state.entries.filter(e => e.date === date && !e.end)
    if (opens.length) {
      opens[0].end = start
    }
    state.entries.push({issueId, start, date})
    state.current = issueId
  },
  CLOSE_ENTRY (state, {issueId, end, date}) {
    let opens = state.entries.filter(e => e.date === date && !e.end && e.issueId === issueId)
    if (opens.length) {
      opens[0].end = end
    }
    state.current = ''
  },
  CLEAR_TRACKING_ENTRIES (state) {
    state.entries.length = 0
    state.current = ''
  }

}

const actions = {
  startTracking ({commit, state}, issueId) {
    if (!state.current) {
      const currentMoment = moment()
      let date = currentMoment.format(DATE_FORMAT)
      let start = currentMoment.format(TIME_FORMAT)
      commit('OPEN_ENTRY', {issueId, date, start})
    }
  },
  stopTracking ({commit, state}, issueId) {
    if (state.current === issueId) {
      const currentMoment = moment()
      let date = currentMoment.format(DATE_FORMAT)
      let end = currentMoment.format(TIME_FORMAT)
      commit('CLOSE_ENTRY', {issueId, date, end})
    }
  },
  clearTrackingEntries ({commit}) {
    commit('CLEAR_TRACKING_ENTRIES')
  }
}

const getters = {
  totalOfTheDay: (state) => (date, issueId) => {
    return state.entries.filter(entriesOfTheDay(date, issueId)).map(diffHours).reduce(sum, 0).toFixed(2)
  },
  entriesOfTheDay: (state) => (date, issueId) => {
    if (issueId) {
      return state.entries.filter(e => e.date === date && e.issueId === issueId)
    } else {
      return state.entries.filter(e => e.date === date)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
