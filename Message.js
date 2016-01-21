/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-22 02:22:05
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
    if (typeof options  == 'string') {
      options = { MessageBody: options }
    } else if (options instanceof Array) {
      options = { Message: options.map(option => typeof option  == 'string' ? { MessageBody: option } : option) }
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

  /*
  * waitseconds
  *  本次ReceiveMessage请求最长的Polling等待时间①，单位为秒
  *  取值范围0~30
  *  Optional
  * numOfMessages
  *  本次BatchReceiveMessage最多获取的消息条数
  *  取值范围1~16
  *  Required
  */
  receive (waitseconds, numOfMessages) {
    const method = 'GET'
    waitseconds = waitseconds || 0
    let URI = `/queues/${this.queue.name}/messages?waitseconds=${waitseconds}`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        let json = parser.toJson(buf.toString(), { object: true })
        if (json.Error) {
          json.Error.status = status
          return reject(json.Error)
        }
        if (numOfMessages) json = json.Messages
        resolve(json.Message)
      })
    })
  }

  /*
  * ReceiptHandle
  *  上次消费后返回的消息ReceiptHandle，详见本文ReceiveMessage接口
  *  Required
  */
  delete (ReceiptHandle) {
    const method = 'DELETE'
    let URI = `/queues/${this.queue.name}/messages`
    if (typeof ReceiptHandle  == 'string') {
      URI += `?ReceiptHandle=${ReceiptHandle}`
    } else if (ReceiptHandle instanceof Array) {
      ReceiptHandle = { ReceiptHandle }
      ReceiptHandle._attr = { xmlns }
    }
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
        payload: convert('ReceiptHandles', ReceiptHandle)
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const xml = buf.toString()
        if (xml) {
          const json = parser.toJson(xml, { object: true })
          if (json.Errors) json.Error = json.Errors.Error
          if (json.Error) {
            json.Error.status = status
            return reject(json.Error)
          }
          return reject(json)
        }
        resolve({
          xmlns,
          Code: 'No Content',
          RequestId: res.responseHeaders['x-mns-request-id'],
          HostId: this.mns.Endpoint,
          status
        })
      })
    })
  }

  /*
  * peekonly=true
  *  表示这次请求只是去查看队列顶部的消息并不会引起消息的状态改变
  *  Required
  * numOfMessages
  *  本次 BatchPeekMessage
  *  最多查看消息条数
  *  Required
  */
  peek (numOfMessages) {
    const method = 'GET'
    let URI = `/queues/${this.queue.name}/messages?peekonly=true`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        let json = parser.toJson(buf.toString(), { object: true })
        if (json.Error) {
          json.Error.status = status
          return reject(json.Error)
        }
        if (numOfMessages) json = json.Messages
        resolve(json.Message)
      })
    })
  }
}