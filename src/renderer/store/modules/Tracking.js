import moment from 'moment'

const state = {
  entries: [],
  current: '',
  lastFileEvent: null
}

const sameDay = (dateObject, day) => moment(dateObject).isSame(day, 'day')
const isToday = (timestamp) => sameDay(timestamp, moment())
const isCurrentMinute = (timestamp) => moment(timestamp).diff(moment(), 'minutes', true) <= 1
const compareStart = (a, b) => moment(a.start).diff(moment(b.start), 'seconds', true)
const diffHours = (e) => moment(e.end).diff(moment(e.start), 'hours', true)
const diffMinutes = (e) => moment(e.end).diff(moment(e.start), 'minutes', true)
const sum = (a, b) => a + b

const byEntriesOfTheDay = (date, issueId) => e => {
  if (issueId) {
    return sameDay(e.start, date) && e.issueId === issueId
  } else {
    return sameDay(e.start, date)
  }
}

const mutations = {
  OPEN_ENTRY (state, {issueId, start}) {
    let opens = state.entries.filter(e => sameDay(e.start, start) && !e.end)

    let thisLast = state.entries.filter(e => e.issueId === issueId).filter(e => e.end).filter(e => isCurrentMinute(e.end))

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
    state.lastFileEvent = moment().toDate()
  },

  CLOSE_ENTRY (state, {issueId, end}) {
    const removeIt = (e) => state.entries.splice(state.entries.indexOf(e), 1)
    let opens = state.entries.filter(e => sameDay(e.start, end) && !e.end && e.issueId === issueId)
    if (opens.length) {
      opens[0].end = end
      if (diffMinutes(opens[0]) <= 1) {
        removeIt(opens[0])
      }
    }
    state.current = ''
  },

  CLEAR_TRACKING_ENTRIES (state, {issueId, date}) {
    const removeIt = (e) => state.entries.splice(state.entries.indexOf(e), 1)
    state.entries.filter(byEntriesOfTheDay(date, issueId)).forEach(removeIt)
    if (issueId === state.current) {
      state.current = ''
    }
  },

  CLEAR_OLD_TRACKING_ENTRIES (state) {
    const byLastWeek = (e) => moment(e.start).isAfter(moment().subtract(1, 'week').startOf('week'))
    const filtered = state.entries.filter(byLastWeek)
    state.entries = filtered
  },

  REMOVE_TRACKING_ENTRY (state, entry) {
    const idx = state.entries.indexOf(entry)
    if (idx < 0) {
      return
    }
    state.entries.splice(idx, 1)
    if (!entry.end && isToday(entry.start)) {
      state.current = ''
    }
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
  clearTrackingEntries ({commit}, {issueId, date = moment()}) {
    commit('CLEAR_TRACKING_ENTRIES', {issueId, date})
  },
  clearOldTrackingEntries ({commit}) {
    commit('CLEAR_OLD_TRACKING_ENTRIES')
  },
  removeTrackingEntry ({commit}, entry) {
    commit('REMOVE_TRACKING_ENTRY', entry)
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
