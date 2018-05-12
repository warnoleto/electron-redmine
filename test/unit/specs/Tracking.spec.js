import { expect } from 'chai'
import tracking from '@/store/modules/Tracking'
import moment from 'moment'

const { OPEN_ENTRY: openEntry, CLOSE_ENTRY: closeEntry } = tracking.mutations
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
  })
  describe('CLOSE_ENTRY', () => {
    context('when the entry is open', () => {
      before(() => {
        const previousEntry = {issueId: 1, start: moment().subtract(50, 'seconds').toDate()}
        end = moment().toDate()
        state.entries = [previousEntry]
        state.current = 2
        closeEntry(state, {issueId, end})
      })
      it('should clear current tracking value', () => {
        expect(state.current).to.be.equal(null)
      })
      it('should set end property to informed value', () => {
        expect(state.entries[0].end).to.be.equal(end)
      })
    })
  })
})
