/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-28 01:58:51
*/
'use strict'

const convert = require('data2xml')()

const xmlns = require('../common/constants').xmlns
const fetchPromise = require('../common/fetchPromise')

module.exports = class {
  constructor (queue) {
    this.mns = queue.mns
    this.queue = queue
  }

  get base() {
    return `/queues/${this.queue.name}/messages`
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
  send (options, callback) { // SendMessage & BatchSendMessage(options instanceof Array)
    const method = 'POST'
    const URI = this.base
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    let Key = 'Message'
    if (typeof options === 'string') {
      options = { MessageBody: options }
    } else if (options instanceof Array) {
      options = { Message: options.map(option => typeof option === 'string' ? { MessageBody: option } : option) }
      Key += 's'
    }
    options._attr = { xmlns }
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      payload: convert(Key, options)
    }, (json, res) => {
      json[Key].status = res.status
      return json[Key]
    }, callback)
  }

  /*
  * waitseconds
  *  本次ReceiveMessage请求最长的Polling等待时间，单位为秒
  *  取值范围0~30
  *  Optional
  * numOfMessages
  *  本次BatchReceiveMessage最多获取的消息条数
  *  取值范围1~16
  *  Required(Batch)
  */
  receive (numOfMessages, waitseconds, callback) { // ReceiveMessage & BatchReceiveMessage(numOfMessages>0)
    if (typeof numOfMessages === 'function') {
      callback = numOfMessages
      numOfMessages = undefined
    } else if (typeof waitseconds === 'function') {
      callback = waitseconds
      waitseconds = undefined
    }
    const method = 'GET'
    waitseconds = waitseconds || 0
    let URI = `${this.base}?waitseconds=${waitseconds}`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      if (numOfMessages) {
        json = json.Messages
        if (!(json.Message instanceof Array)) {
          json.Message = [json.Message]
        }
      }
      return json.Message
    }, callback)
  }

  /*
  * ReceiptHandle
  *  上次消费后返回的消息ReceiptHandle，详见本文ReceiveMessage接口
  *  Required
  */
  delete (receiptHandle, callback) { // DeleteMessage & BatchDeleteMessage(receiptHandle instanceof Array)
    const method = 'DELETE'
    let URI = this.base
    if (typeof receiptHandle === 'string') {
      URI += `?receiptHandle=${receiptHandle}`
    } else if (receiptHandle instanceof Array) {
      receiptHandle = { receiptHandle }
      receiptHandle._attr = { xmlns }
    }
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      payload: convert('ReceiptHandles', receiptHandle)
    }, (json, res) => ({
      xmlns,
      Code: 'No Content',
      RequestId: res.responseHeaders['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.status
    }), callback)
  }

  /*
  * peekonly=true
  *  表示这次请求只是去查看队列顶部的消息并不会引起消息的状态改变
  *  Required
  * numOfMessages
  *  本次 BatchPeekMessage 最多查看消息条数
  *  Required(Batch)
  */
  peek (numOfMessages, callback) { // PeekMessage & BatchPeekMessage(numOfMessages>0)
    if (typeof numOfMessages === 'function') {
      callback = numOfMessages
      numOfMessages = undefined
    }
    const method = 'GET'
    let URI = `${this.base}?peekonly=true`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      if (numOfMessages) {
        json = json.Messages
        if (!(json.Message instanceof Array)) {
          json.Message = [json.Message]
        }
      }
      return json.Message
    }, callback)
  }

  /*
  * ReceiptHandle
  *  上次消费后返回的消息 ReceiptHandle ，详见 ReceiveMessage 接口
  *  Required
  * VisibilityTimeout
  *  从现在到下次可被用来消费的时间间隔，单位为秒
  *  Required
  */
  visibility (receiptHandle, visibilityTimeout, callback) { // ChangeMessageVisibility
    const method = 'PUT'
    const URI = `${this.base}?receiptHandle=${receiptHandle}&visibilityTimeout=${visibilityTimeout}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      json.ChangeVisibility.status = res.status
      return json.ChangeVisibility
    }, callback)
  }

  /*
  * waitseconds
  *  一次ReceiveMessage请求最长的Polling等待时间，单位为秒
  *  取值范围0~30，默认值为30（秒）
  *  Optional
  * numOfMessages
  *  一次BatchReceiveMessage最多获取的消息条数
  *  取值范围1~16，默认值为16（条）
  *  Optional
  * delay
  *  一次ReceiveMessage轮询等待时间，单位为秒
  *  取值范围整数值，默认值为0（秒）
  *  Optional
  */
  subscribe (delay, numOfMessages, waitseconds, callback) {
    if (typeof delay === 'function') {
      callback = delay
      delay = undefined
    } else if (typeof numOfMessages === 'function') {
      callback = numOfMessages
      numOfMessages = undefined
    } else if (typeof waitseconds === 'function') {
      callback = waitseconds
      waitseconds = undefined
    }
    delay = delay || 0
    waitseconds = waitseconds || 30
    numOfMessages = numOfMessages || 16
    this.receive(numOfMessages, waitseconds, (err, res) => {
      let receiptHandles
      if (res instanceof Array) receiptHandles = res.map(msg => msg.ReceiptHandle)
      else if (res) receiptHandles = res.ReceiptHandle
      callback(err, res, receiptHandle => {
        receiptHandle = receiptHandle || receiptHandles
        if (receiptHandle) this.delete(receiptHandle)
        setTimeout(() => this.subscribe(delay, numOfMessages, waitseconds, callback), delay * 1000)
      })
    })
  }
}