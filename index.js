/* 
* @Author: zyc
* @Date:   2016-01-20 13:17:37
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 01:51:14
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl
const convert = require('data2xml')()

const Signature = require('./Signature')

module.exports = class {
  constructor (options) {
    const { accessKeyId, secretAccessKey, endpoint, apiVersion } = options
    this.Signature = new Signature(secretAccessKey, apiVersion)
    this.AccessKeyId = accessKeyId
    this.XMnsVersion = apiVersion
    this.Endpoint = endpoint
  }

  authorization (options) {
    const { DATE, Signature } = this.Signature.sign(options)
    return { DATE, Authorization: `MNS ${this.AccessKeyId}:${Signature}` }
  }

  createQueue (queueName, options) {
    const method = 'PUT'
    const URI = `/queues/${queueName}`
    const { DATE, Authorization } = this.authorization({ VERB: method, CanonicalizedResource: URI })
    options = options || {}
    options._attr = { xmlns: 'http://mns.aliyuncs.com/doc/v1/' }
    fetchUrl(this.Endpoint + URI, {
      method,
      headers: {
        Date: DATE,
        Authorization,
        'x-mns-version': this.XMnsVersion
      },
      payload: convert('Queue', options)
    }, (err, res, buf) => {
      console.log(buf.toString())
    })
  }
}