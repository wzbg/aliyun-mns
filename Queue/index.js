/* 
* @Author: zyc
* @Date:   2016-01-20 23:16:03
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-26 23:41:17
*/
'use strict'

const convert = require('data2xml')()

const Message = require('./Message')
const xmlns = require('../common/constants').xmlns
const fetchPromise = require('../common/fetchPromise')

/*
* DelaySeconds
*  发送到该 Queue 的所有消息默认将以DelaySeconds参数指定的秒数延后可被消费，单位为秒。
*  0-604800秒（7天）范围内某个整数值，默认值为0（秒）
* MaximumMessageSize
*  发送到该Queue的消息体的最大长度，单位为byte。
*  1024(1KB)-65536（64KB）范围内的某个整数值，默认值为65536（64KB）。
* MessageRetentionPeriod
*  消息在该 Queue 中最长的存活时间，从发送到该队列开始经过此参数指定的时间后，不论消息是否被取出过都将被删除，单位为秒。
*  60 (1分钟)-1296000 (15 天)范围内某个整数值，默认值为345600 (4 天)
* VisibilityTimeout
*  消息从该 Queue 中取出后从Active状态变成Inactive状态后的持续时间，单位为秒。
*  1-43200(12小时)范围内的某个值整数值，默认值为30（秒）
* PollingWaitSeconds
*  当 Queue 中没有消息时，针对该 Queue 的 ReceiveMessage 请求最长的等待时间，单位为秒。
*  0-30秒范围内的某个整数值，默认值为0（秒）
*/
module.exports = class {
  constructor (mns, name, options) {
    this.mns = mns
    this.name = name
    this.options = options || {}
  }

  get base() {
    return '/queues'
  }

  message () {
    return new Message(this)
  }

  connect (callback) {
    return new Promise((resolve, reject) => {
      this.create(callback)
        .then(res => resolve(res))
        .catch(err => this.create(true, callback)
          .then(res => resolve(res))
          .catch(err => reject(err)))
    })
  }

  create (metaoverride, callback) { // CreateQueue & SetQueueAttributes(metaoverride=true)
    if (typeof metaoverride === 'function') {
      callback = metaoverride
      metaoverride = undefined
    }
    const method = 'PUT'
    let URI = `${this.base}/${this.name}`
    if (metaoverride) URI += `?metaoverride=${metaoverride}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    const options = this.options || {}
    options._attr = { xmlns }
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      payload: convert('Queue', options)
    }, (json, res) => ({
      xmlns,
      Code: res.status === 201 ? 'Created' : 'No Content',
      RequestId: res.responseHeaders['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.status
    }), callback)
  }

  delete (callback) { // DeleteQueue
    const method = 'DELETE'
    const URI = `${this.base}/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => ({
      xmlns,
      Code: 'No Content',
      RequestId: res.responseHeaders['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.status
    }), callback)
  }

  get (callback) { // GetQueueAttributes
    const method = 'GET'
    const URI = `${this.base}/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      json.Queue.status = res.status
      return json.Queue
    }, callback)
  }

  /*
  * x-mns-marker
  *  请求下一个分页的开始位置，一般从上次分页结果返回的NextMarker获取。
  *  Optional
  * x-mns-ret-number
  *  单次请求结果的最大返回个数，可以取1-1000范围内的整数值，默认值为1000。
  *  Optional
  * x-mns-prefix
  *  按照该前缀开头的 queueName 进行查找。
  *  Optional
  */
  list (headers, callback) { // ListQueue
    if (typeof headers === 'function') {
      callback = headers
      headers = undefined
    }
    const method = 'GET'
    const URI = this.base
    headers = headers || {}
    if (!headers['x-mns-version']) {
      headers['x-mns-version'] = this.mns.XMnsVersion
    }
    const xmns = []
    for (let header of Object.keys(headers).sort()) {
      if (header.startsWith('x-mns-')) {
        xmns.push(header + ':' + headers[header])
      }
    }
    const authorization = this.mns.authorization({
      VERB: method,
      CanonicalizedResource: URI,
      CanonicalizedMNSHeaders: xmns.join('\n')
    })
    headers.Date = authorization.DATE
    headers.Authorization = authorization.Authorization
    return fetchPromise(this.mns.Endpoint + URI, {
      headers
    }, (json, res) => {
      const nextMarker = json.Queues.NextMarker
      let queues = json.Queues.Queue
      if (!queues) queues = []
      else if (!(queues instanceof Array)) queues = [queues]
      queues = queues.map(queue => queue.QueueURL.substring(queue.QueueURL.lastIndexOf('/') + 1))
      return { queues, nextMarker, status: res.status }
    }, callback)
  }
}