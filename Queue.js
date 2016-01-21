/* 
* @Author: zyc
* @Date:   2016-01-20 23:16:03
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 14:18:59
*/
'use strict'

const assert = require('assert')
const parser = require('xml2json')
const convert = require('data2xml')()
const fetchUrl = require('fetch').fetchUrl

const xmlns = 'http://mns.aliyuncs.com/doc/v1/'

/*
* DelaySeconds
*  发送到该 Queue 的所有消息默认将以DelaySeconds参数指定的秒数延后可被消费，单位为秒。
*  0-604800秒（7天）范围内某个整数值，默认值为0
* MaximumMessageSize
*  发送到该Queue的消息体的最大长度，单位为byte。
*  1024(1KB)-65536（64KB）范围内的某个整数值，默认值为65536（64KB）。
* MessageRetentionPeriod
*  消息在该 Queue 中最长的存活时间，从发送到该队列开始经过此参数指定的时间后，不论消息是否被取出过都将被删除，单位为秒。
*  60 (1分钟)-1296000 (15 天)范围内某个整数值，默认值345600 (4 天)
* VisibilityTimeout
*  消息从该 Queue 中取出后从Active状态变成Inactive状态后的持续时间，单位为秒。
*  1-43200(12小时)范围内的某个值整数值，默认为30（秒）
* PollingWaitSeconds
*  当 Queue 中没有消息时，针对该 Queue 的 ReceiveMessage 请求最长的等待时间，单位为秒。
*  0-30秒范围内的某个整数值，默认为0（秒）
*/
module.exports = class {
  constructor (mns, name, options) {
    assert.ok(name, 'name required')
    this.mns = mns
    this.name = name
    this.options = options || {}
  }

  create (metaoverride) {
    const method = 'PUT'
    let URI = `/queues/${this.name}`
    if (metaoverride) URI += `?metaoverride=${metaoverride}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    const options = this.options || {}
    options._attr = { xmlns }
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
        payload: convert('Queue', options)
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const xml = buf.toString()
        if (xml) {
          const json = parser.toJson(xml, { object: true })
          json.Error.status = status
          return reject(json.Error)
        }
        return resolve({
          xmlns,
          Code: status === 201 ? 'Created' : 'No Content',
          RequestId: res.responseHeaders['x-mns-request-id'],
          HostId: this.mns.Endpoint,
          status
        })
      })
    })
  }

  get () {
    const method = 'GET'
    const URI = `/queues/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const json = parser.toJson(buf.toString(), { object: true })
        if (json.Queue) {
          json.Queue.status = status
          return resolve(json.Queue)
        } else {
          json.Error.status = status
          return reject(json.Error)
        }
      })
    })
  }

  delete () {
    const method = 'DELETE'
    const URI = `/queues/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return new Promise((resolve, reject) => {
      fetchUrl(this.mns.Endpoint + URI, {
        method,
        headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      }, (err, res, buf) => {
        if (err) return reject(err)
        const status = res.status
        const xml = buf.toString()
        if (xml) {
          const json = parser.toJson(xml, { object: true })
          json.Error.status = status
          return reject(json.Error)
        }
        return resolve({
          xmlns,
          Code: 'No Content',
          RequestId: res.responseHeaders['x-mns-request-id'],
          HostId: this.mns.Endpoint,
          status
        })
      })
    })
  }
}