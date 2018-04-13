import request from 'request'
import Url from 'url'
import js2xmlparser from 'js2xmlparser'
import xml2js from 'xml2js'

export default class {
  constructor (host, apiKey, port) {
    if (!host) {
      throw new Error('host not specified!')
    }

    if (typeof host === 'string') {
      host = Url.parse(host)
    } else if (typeof host !== 'object') {
      throw new Error('host should be a string or url object!')
    }

    if (port) {
      host.port = port
      host.host += ':' + port.toString()
    }

    let baseUrl = Url.format(host)

    this.apiKey = apiKey
    this._request = request.defaults({ baseUrl })
  }

  jsonToXml = obj => {
    if (typeof obj === 'object') {
      for (let p in obj) {
        return js2xmlparser.parse(p, obj[p])
      }
    }
    return ''
  }

  post = (uri, body, callback) => {
    body = this.jsonToXml(body)

    let params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'X-Redmine-API-Key': this.apiKey
      },
      body: body
    }

    this._request(uri, params, (err, res, body) => {
      if (err) callback(err)
      if (res.statusCode !== 200 && res.statusCode !== 201) {
        var msg = {
          ErrorCode: res.statusCode,
          Message: res.statusMessage,
          Detail: body
        }
        return callback(JSON.stringify(msg))
      }
      return xml2js.parseString(body, {explicitArray: false, mergeAttrs: true}, (err, json) => {
        if (err) callback(err)
        callback(null, json)
      })
    })
  }
}
