/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 23:23:21
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

  /*
  * MessageBody
  *  消息正文
  *  UTF-8字符集
  *  Required
  * DelaySeconds
  *  DelaySeconds 指定的秒数延后可被消费，单位为秒
  *  0-604800秒（7天）范围内某个整数值，默认值为0
  *  Optional
  * Priority
  *  指定消息的优先级权值，优先级越高的消息，越容易更早被消费
  *  取值范围1~16（其中1为最高优先级），默认优先级为8
  *  Optional
  */
  send (options) {
    const method = 'POST'
    const URI = `/queues/${this.queue.name}/messages`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    let Key = 'Message'
    if (options instanceof Array) {
      options = { Message: options }
      Key += 's'
    }
    options._attr = { xmlns }
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
        payload: convert(Key, options)
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const json = parser.toJson(buf.toString(), { object: true })
        if (json.Error) {
          json.Error.status = status
          return reject(json.Error)
        }
        json[Key].status = status
        resolve(json[Key])
      })
    })
  }

  receive (waitseconds) {
    const method = 'GET'
    let URI = `/queues/${this.queue.name}/messages`
    if (waitseconds) URI += `?waitseconds=${waitseconds}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
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
}