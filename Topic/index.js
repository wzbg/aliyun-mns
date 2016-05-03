/* 
* @Author: zyc
* @Date:   2016-01-23 02:03:47
* @Last Modified by:   zyc
* @Last Modified time: 2016-05-03 18:03:53
*/
'use strict'

const convert = require('data2xml')()

const Message = require('./Message')
const Subscription = require('./Subscription')
const xmlns = require('../common/constants').xmlns
const fetchPromise = require('../common/fetchPromise')

/*
* MaximumMessageSize
*  发送到该 Topic 的消息体最大长度，单位为Byte
*  1024(1KB) - 65536(64KB)范围内的某个整数值，默认值为65536(64KB)
*  Optional
*/
module.exports = class {
  constructor (mns, name, options) {
    this.mns = mns
    this.name = name
    if (typeof options === 'number') {
      options = { MaximumMessageSize: options }
    }
    this.options = options
  }

  get base() {
    return '/topics'
  }

  message () {
    return new Message(this)
  }

  subscription (name, options) {
    return new Subscription(this, name, options)
  }

  create (metaoverride, callback) { // CreateTopic & SetTopicAttributes(metaoverride=true)
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
      body: convert('Topic', options)
    }, (json, res) => ({
      xmlns,
      Code: res.statusCode === 201 ? 'Created' : 'No Content',
      RequestId: res.headers['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.statusCode
    }), callback)
  }

  delete (callback) { // DeleteTopic
    const method = 'DELETE'
    const URI = `${this.base}/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => ({
      xmlns,
      Code: 'No Content',
      RequestId: res.headers['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.statusCode
    }), callback)
  }

  get (callback) { // GetTopicAttributes
    const method = 'GET'
    const URI = `${this.base}/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      json.Topic.status = res.statusCode
      return json.Topic
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
  *  按照该前缀开头的 topicName 进行查找。
  *  Optional
  */
  list (headers, callback) { // ListTopic
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
      const nextMarker = json.Topics.NextMarker
      let topics = json.Topics.Topic
      if (!topics) topics = []
      else if (!(topics instanceof Array)) topics = [topics]
      topics = topics.map(topic => topic.TopicURL.substring(topic.TopicURL.lastIndexOf('/') + 1))
      return { topics, nextMarker, status: res.statusCode }
    }, callback)
  }
}