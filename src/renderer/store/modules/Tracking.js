import moment from 'moment'

const sameDay = (dateObject, day) => moment(dateObject).isSame(day, 'day')

const byEntriesOfTheDay = (date, issueId) => e => {
  if (issueId) {
    return sameDay(e.start, date) && e.issueId === issueId
  } else {
    return sameDay(e.start, date)
  }
}
const compareStart = (a, b) => moment(a.start).diff(moment(b.start), 'seconds', true)

const diffHours = (e) => {
  let end = e.end ? moment(e.end) : moment()
  return end.diff(moment(e.start), 'hours', true)
}

const thisMinute = (timestamp) => {
  const diffAsMinutes = moment.duration(moment(timestamp).diff(moment())).asMinutes().toFixed(1)
  return Math.abs(diffAsMinutes) <= 1
}

const sum = (a, b) => a + b

const state = {
  entries: [],
  current: '',
  lastFileEvent: 0
}

const mutations = {
  OPEN_ENTRY (state, {issueId, start}) {
    let opens = state.entries.filter(e => sameDay(e.start, start) && !e.end)

    let thisLast = state.entries.filter(e => e.issueId === issueId).filter(e => e.end).filter(e => thisMinute(e.end))

    if (thisLast.length) {
      thisLast[0].end = undefined
      state.current = issueId
      return
    }

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
    const byLastWeek = (e) => moment(e.start).isAfter(moment().subtract(1, 'week').startOf('week'))
    const filtered = state.entries.filter(byLastWeek)
    state.entries = filtered
  },
  FILE_EVENT_RECEIVED (state, timestamp) {
    state.lastFileEvent = timestamp
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
    if (issueId && state.current === issueId) {
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
  },
  registerFileChanged ({commit}) {
    commit('FILE_EVENT_RECEIVED', moment().toDate())
  }

}

const getters = {
  totalOfTheDay: (state) => (date, issueId) => {
    return state.entries.filter(byEntriesOfTheDay(date, issueId)).map(diffHours).reduce(sum, 0).toFixed(2)
  },
  entriesOfTheDay: (state) => (date, issueId) => {
    return state.entries.filter(byEntriesOfTheDay(date, issueId)).sort(compareStart)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
