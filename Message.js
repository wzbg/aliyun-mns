/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 22:44:04
*/
'use strict'

const parser = require('xml2json')
const convert = require('data2xml')()
const fetchUrl = require('fetch').fetchUrl

const xmlns = 'http://mns.aliyuncs.com/doc/v1/'

module.exports = class {
  constructor (queue) {
    this.mns = queue.mns
    this.queue = queue
  }

  send (message) {
    const method = 'POST'
    const URI = `/queues/${this.queue.name}/messages`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    message._attr = { xmlns }
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
        payload: convert('Message', message)
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const json = parser.toJson(buf.toString(), { object: true })
        if (json.Error) {
          json.Error.status = status
          return reject(json.Error)
        }
        json.Message.status = status
        resolve(json.Message)
      })
    })
  }

  batchSend (messages) {
    const method = 'POST'
    const URI = `/queues/${this.queue.name}/messages`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    messages = { Message: messages }
    messages._attr = { xmlns }
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
        payload: convert('Messages', messages)
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const json = parser.toJson(buf.toString(), { object: true })
        if (json.Error) {
          json.Error.status = status
          return reject(json.Error)
        }
        json.Messages.status = status
        resolve(json.Messages)
      })
    })
  }
}