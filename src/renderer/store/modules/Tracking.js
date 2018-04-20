import moment from 'moment'

const sameDay = (dateObject, day) => moment(dateObject).isSame(day, 'day')
const entriesOfTheDay = (date, issueId) => e => {
  if (issueId) {
    return sameDay(e.start, date) && e.issueId === issueId
  } else {
    return sameDay(e.start, date)
  }
}
const diffHours = (e) => {
  let end = e.end ? moment(e.end) : moment()
  return end.diff(moment(e.start), 'hours', true)
}
const sum = (a, b) => a + b

const state = {
  entries: [],
  current: ''
}

const mutations = {
  OPEN_ENTRY (state, {issueId, start}) {
    let opens = state.entries.filter(e => sameDay(e.start, start) && !e.end)
    if (opens.length) {
      opens[0].end = start
    }
    state.entries.push({issueId, start})
    state.current = issueId
  },
  CLOSE_ENTRY (state, {issueId, end}) {
    let opens = state.entries.filter(e => sameDay(e.start, end) && !e.end && e.issueId === issueId)
    if (opens.length) {
      opens[0].end = end
    }
    state.current = ''
  },
  CLEAR_TRACKING_ENTRIES (state) {
    state.entries.length = 0
    state.current = ''
  },
  CLEAR_OLD_TRACKING_ENTRIES (state) {
    const byLastWeek = (e) => moment(e.start).isSameOrBefore(moment().subtract(1, 'week').startOf('week'))
    const filtered = state.entries.filter(byLastWeek)
    state.entries = filtered
  }

}

const actions = {
  startTracking ({commit, state}, issueId) {
    if (!state.current) {
      const currentMoment = moment()
      let start = currentMoment.toDate()
      commit('OPEN_ENTRY', {issueId, start})
    }
  },
  stopTracking ({commit, state}, issueId) {
    if (state.current === issueId) {
      const currentMoment = moment()
      let end = currentMoment.toDate()
      commit('CLOSE_ENTRY', {issueId, end})
    }
  },
  clearTrackingEntries ({commit}) {
    commit('CLEAR_TRACKING_ENTRIES')
  },
  clearOldTrackingEntries ({commit}) {
    commit('CLEAR_OLD_TRACKING_ENTRIES')
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
