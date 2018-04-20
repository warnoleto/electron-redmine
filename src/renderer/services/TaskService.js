import Redmine from 'node-redmine'
import RedminePostHelper from '@/globals/redmine-post-helper'

export default class {
  constructor ({hostname, apiKey, workingStatus, pausedStatus}) {
    this.hostname = hostname
    this.apiKey = apiKey
    this.postHelper = new RedminePostHelper(hostname, apiKey)
    this.workingStatus = workingStatus
    this.pausedStatus = pausedStatus
    this.redmine = new Redmine(hostname, {apiKey})
  }

  startTask (issueId, callback) {
    let param = {
      status_id: this.workingStatus,
      assigned_to_id: 'me'
    }
    this.redmine.issues(param, (err, data) => {
      if (err) callback(err)
      if (data.issues.length) callback(new Error('Você ja possui uma atividade em andamento'))
      let params = {issue: {status_id: this.workingStatus}}
      this.postHelper.put(`/issues/${issueId}.json`, params, (err, data) => callback(err, data))
    })
  }

  pauseTask (issueId, callback) {
    let params = {issue: {status_id: this.pausedStatus}}
    this.postHelper.put(`/issues/${issueId}.json`, params, (err, data) => callback(err, data))
  }

  myIssues (trackingId, callback) {
    const isTheCurrent = item => item.id === trackingId

    this.redmine.issues({assigned_to_id: 'me'}, (err, issuesData) => {
      if (err) callback(err)

      if (trackingId && issuesData.issues.filter(isTheCurrent).length === 0) {
        this.redmine.get_issue_by_id(trackingId, {}, (err, currentIssueData) => {
          if (err) callback(err)

          issuesData.issues.unshift(currentIssueData.issue)
          callback(err, issuesData)
        })
      } else {
        callback(err, issuesData)
      }
    })
  }

  timeEntryActivities (callback) {
    this.redmine.time_entry_activities(callback)
  }
}
