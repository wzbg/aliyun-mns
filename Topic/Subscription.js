/* 
* @Author: zyc
* @Date:   2016-01-23 02:04:04
* @Last Modified by:   zyc
* @Last Modified time: 2016-05-03 18:04:03
*/
'use strict'

const convert = require('data2xml')()

const xmlns = require('../common/constants').xmlns
const fetchPromise = require('../common/fetchPromise')

/*
* Endpoint
*  描述此次订阅中接收消息的终端地址
*  目前支持HttpEndpoint，必须以"http://"为前缀
*  Required
* NotifyStrategy
*  描述了向 Endpoint 推送消息出现错误时的重试策略
*  BACKOFF_RETRY 或者 EXPONENTIAL_DECAY_RETRY，默认值为BACKOFF_RETRY，重试策略的具体描述请参考 基本概念/NotifyStrategy
*  Optional
* NotifyContentFormat
*  描述了向 Endpoint 推送的消息格式
*  XML 或者 SIMPLIFIED，默认值为 XML，消息格式的具体描述请参考 基本概念/NotifyContentFormat
*  Optional
*/
module.exports = class {
  constructor (topic, name, options) {
    this.mns = topic.mns
    this.topic = topic
    this.name = name
    if (typeof options === 'string') {
      options = { Endpoint: options }
    }
    this.options = options
  }

  get base() {
    return `/topics/${this.topic.name}/subscriptions`
  }

  subscribe (metaoverride, callback) { // Subscribe & SetSubscriptionAttributes(metaoverride=true)
    if (typeof metaoverride === 'function') {
      callback = metaoverride
      metaoverride = undefined
    }
    const method = 'PUT'
    let URI = `${this.base}/${this.name}`
    const options = this.options || {}
    options._attr = { xmlns }
    if (metaoverride) {
      delete options.Endpoint
      URI += `?metaoverride=${metaoverride}`
    }
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      body: convert('Subscription', options)
    }, (json, res) => ({
      xmlns,
      Code: res.statusCode === 201 ? 'Created' : 'No Content',
      RequestId: res.headers['x-mns-request-id'],
      HostId: this.mns.Endpoint,
      status: res.statusCode
    }), callback)
  }

  unsubscribe (callback) { // Unsubscribe
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

  get (callback) { // GetSubscriptionAttributes
    const method = 'GET'
    const URI = `${this.base}/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    return fetchPromise(this.mns.Endpoint + URI, {
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion }
    }, (json, res) => {
      json.Subscription.status = res.statusCode
      return json.Subscription
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
  *  按照该前缀开头的 subscriptionName 进行查找。
  *  Optional
  */
  list (headers, callback) { // ListSubscriptionByTopic
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
      const nextMarker = json.Subscriptions.NextMarker
      let subscriptions = json.Subscriptions.Subscription
      if (!subscriptions) subscriptions = []
      else if (!(subscriptions instanceof Array)) subscriptions = [subscriptions]
      subscriptions = subscriptions.map(subscription => subscription.SubscriptionURL.substring(subscription.SubscriptionURL.lastIndexOf('/') + 1))
      return { subscriptions, nextMarker, status: res.statusCode }
    }, callback)
  }
}