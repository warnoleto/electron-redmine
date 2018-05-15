import { expect } from 'chai'
import tracking from '@/store/modules/Tracking'
import moment from 'moment'

const { OPEN_ENTRY: openEntry, CLOSE_ENTRY: closeEntry, CLEAR_TRACKING_ENTRIES: clearEntries } = tracking.mutations
const state = { entries: [], current: null, lastFileEvent: null }
let start = null
let end = null
let issueId = null

describe('mutations', () => {
  before(() => {
    start = moment().toDate()
    issueId = 1
  })
  describe('OPEN_ENTRY', () => {
    context('when has no entry', () => {
      before(() => {
        state.entries = []
        state.current = null
        openEntry(state, {issueId, start})
      })
      it('should start a new tracking', () => {
        expect(state.entries.length).to.be.equal(1)
      })
      it('current tracking sould be equals to issueId', () => {
        expect(state.current).to.be.equal(issueId)
      })
      it('start time of the entry shoud be equal to informed start date', () => {
        expect(state.entries[0].start).to.be.equal(start)
      })
      it('end time of the entry shoud be undefined', () => {
        expect(state.entries[0].end).to.be.equal(undefined)
      })
      it('last file event should be updated', () => {
        expect(state.lastFileEvent).to.be.greaterThan(moment().subtract(1, 'seconds').toDate())
      })
    })

    context('there is an open entry for a differente issueId', () => {
      before(() => {
        const previousEntry = {issueId: 2, start: moment().subtract(1, 'minute').toDate()}
        state.entries = [previousEntry]
        state.current = 2
        openEntry(state, {issueId, start})
      })
      it('should not open add entry', () => {
        expect(state.entries.length).to.be.equal(1)
      })
      it('should not change the current issueId', () => {
        expect(state.current).to.be.equal(2)
      })
    })

    context('reopening recently closed entry', () => {
      before(() => {
        const previousEntry = {issueId: 1, start: moment().subtract(1, 'minute').toDate(), end: moment().toDate()}
        state.entries = [previousEntry]
        state.current = null
        openEntry(state, {issueId, start})
      })
      it('should not add another entry', () => {
        expect(state.entries.length).to.be.equal(1)
      })
      it('should clear end time', () => {
        expect(state.entries[0].end).to.be.equal(undefined)
      })
      it('should set current tracking to issueId', () => {
        expect(state.current).to.be.equal(issueId)
      })
    })

    context('open different issue when there is a recently closed', () => {
      before(() => {
        const previousEntry = {issueId: 2, start: moment().subtract(1, 'minute').toDate(), end: moment().toDate()}
        state.entries = [previousEntry]
        state.current = null
        openEntry(state, {issueId, start})
      })
      it('should add another entry', () => {
        expect(state.entries.length).to.be.equal(2)
      })
      it('should set current to issueId', () => {
        expect(state.current).to.be.equal(issueId)
      })
    })
    context('entry started yesterday', () => {
      before(() => {
        const previousEntry = {issueId: 2, start: moment().subtract(1, 'day').toDate()}
        state.entries = [previousEntry]
        state.current = 1
        openEntry(state, {issueId, start})
      })
      it('should track the informed issueId', () => {
        expect(state.current).to.be.equal(issueId)
      })
      it('should add a new entry', () => {
        expect(state.entries.length).to.be.equal(2)
      })
    })
  })

  describe('CLOSE_ENTRY', () => {
    context('when the entry is open', () => {
      before(() => {
        const previousEntry = {issueId: 1, start: moment().subtract(61, 'seconds').toDate()}
        state.entries = [previousEntry]
        state.current = 1
        end = moment().toDate()
        closeEntry(state, {issueId, end})
      })
      it('should clear current tracking value', () => {
        expect(state.current).to.be.equal(null)
      })
      it('should set end property to informed end value', () => {
        expect(state.entries[0].end).to.be.equal(end)
      })
    })

    context('when the entry was recently opened', () => {
      before(() => {
        const previousEntry = {issueId: 1, start: moment().subtract(1, 'seconds').toDate()}
        state.entries = [previousEntry]
        state.current = 1
        end = moment().toDate()
        closeEntry(state, {issueId, end})
      })
      it('should clear current tracking value', () => {
        expect(state.current).to.be.equal(null)
      })
      it('should remove the entry', () => {
        expect(state.entries.length).to.be.equal(0)
      })
    })
    context('when trying to close an entry different of the current one', () => {
      before(() => {
        const previousEntry = {issueId: 2, start: moment().subtract(61, 'seconds').toDate()}
        state.entries = [previousEntry]
        state.current = 2
        end = moment().toDate()
        closeEntry(state, {issueId, end})
      })
      it('should not close it', () => {
        expect(state.entries[0].end).to.be.equal(undefined)
      })
      it('should keep the tracking the current issueId', () => {
        expect(state.current).to.be.equal(2)
      })
    })
  })

  describe('CLEAR_TRACKING_ENTRIES', () => {
    beforeEach(() => {
      const entry1 = {issueId: 1, start: moment().subtract(1, 'day').toDate(), end: moment().subtract(23, 'hours').toDate()}
      const entry2 = {issueId: 1, start: moment().subtract(6, 'minutes').toDate(), end: moment().subtract(4, 'minutes').toDate()}
      const entry3 = {issueId: 2, start: moment().subtract(4, 'minutes').toDate(), end: moment().subtract(2, 'minutes').toDate()}
      const entry4 = {issueId: 2, start: moment().subtract(1, 'minutes').toDate()}
      state.entries = [entry1, entry2, entry3, entry4]
      state.current = 2
    })
    context('when issueId is not informed', () => {
      beforeEach(() => {
        clearEntries(state, {date: moment().toDate()})
      })
      it('should remove all entries of the same date', () => {
        expect(state.entries.length).to.be.equal(1)
      })
      it('should clear current tracking', () => {
        expect(state.current).to.be.equal(null)
      })
    })
    context('when informed issueId is not the current tracking', () => {
      beforeEach(() => {
        clearEntries(state, {issueId: 1, date: moment().toDate()})
      })
      it('should remove all entries of the same date and issueId', () => {
        expect(state.entries.length).to.be.equal(3)
      })
      it('should keep current tracking', () => {
        expect(state.current).to.be.equal(2)
      })
    })
  })
})
