/* 
* @Author: zyc
* @Date:   2016-01-23 02:04:31
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 17:42:33
*/
'use strict'

const convert = require('data2xml')()

const xmlns = require('../common/constants').xmlns
const fetchPromise = require('../common/fetchPromise')

module.exports = class {
  constructor (topic) {
    this.mns = topic.mns
    this.topic = topic
  }

  get base() {
    return `/topics/${this.topic.name}/messages`
  }

  /*
  * MessageBody
  *  消息正文
  *  UTF-8字符集
  *  Required
  */
  publish (options, callback) { // PublishMessage
    const method = 'POST'
    const URI = this.base
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    if (typeof options === 'string') options = { MessageBody: options }
    options._attr = { xmlns }
    return fetchPromise(this.mns.Endpoint + URI, {
      method,
      headers: { Date: DATE, Authorization, 'x-mns-version': this.mns.XMnsVersion },
      payload: convert('Message', options)
    }, (json, res) => {
      json.Message.status = res.status
      return json.Message
    }, callback)
  }
}