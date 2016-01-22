/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 01:49:00
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
  send (options, callback) {
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
  *  本次ReceiveMessage请求最长的Polling等待时间①，单位为秒
  *  取值范围0~30
  *  Optional
  * numOfMessages
  *  本次BatchReceiveMessage最多获取的消息条数
  *  取值范围1~16
  *  Required
  */
  receive (waitseconds, numOfMessages, callback) {
    const method = 'GET'
    waitseconds = waitseconds || 0
    let URI = `/queues/${this.queue.name}/messages?waitseconds=${waitseconds}`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      if (numOfMessages) json = json.Messages
      return json.Message
    }, callback)
  }

  /*
  * ReceiptHandle
  *  上次消费后返回的消息ReceiptHandle，详见本文ReceiveMessage接口
  *  Required
  */
  delete (receiptHandle, callback) {
    const method = 'DELETE'
    let URI = `/queues/${this.queue.name}/messages`
    if (typeof receiptHandle  == 'string') {
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
  *  本次 BatchPeekMessage
  *  最多查看消息条数
  *  Required
  */
  peek (numOfMessages, callback) {
    const method = 'GET'
    let URI = `/queues/${this.queue.name}/messages?peekonly=true`
    if (numOfMessages) URI += `&numOfMessages=${numOfMessages}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      if (numOfMessages) json = json.Messages
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
  visibility (receiptHandle, visibilityTimeout, callback) {
    const method = 'PUT'
    const URI = `/queues/${this.queue.name}/messages?receiptHandle=${receiptHandle}&visibilityTimeout=${visibilityTimeout}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      json.ChangeVisibility.status = res.status
      return json.ChangeVisibility
    }, callback)
  }

  subscribe (waitseconds, numOfMessages, delay, callback) {
    delay = delay || 0
    this.receive(waitseconds, numOfMessages, (err, res) => {
      callback(err, res, () => this.delete(res instanceof Array ? res.map(msg => msg.ReceiptHandle) : res.ReceiptHandle))
      setTimeout(() => this.subscribe(waitseconds, numOfMessages, delay, callback), delay * 1000)
    })
  }
}