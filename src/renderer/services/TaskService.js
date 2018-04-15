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

  startTask = (issueId, callback) => {
    let param = {
      status_id: this.workingStatus,
      assigned_to_id: 'me'
    }
    this.redmine.issues(param, (err, data) => {
      if (err) callback(new Error('Ocorreu uma falha ao tentar alterar a atividade. Tente novamente mais tarde.'))
      if (data.issues.length) callback(new Error('Você ja possui uma atividade em andamento'))
      let params = {issue: {status_id: this.workingStatus}}
      this.postHelper.request('PUT', `/issues/${issueId}.json`, params, (err, data) => callback(err, data))
    })
  }

  pauseTask = (issueId, callback) => {
    let params = {issue: {status_id: this.pausedStatus}}
    this.postHelper.request('PUT', `/issues/${issueId}.json`, params, (err, data) => callback(err, data))
  }
}
