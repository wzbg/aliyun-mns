/* 
* @Author: zyc
* @Date:   2016-01-20 13:17:37
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 18:48:32
*/
'use strict'

const Queue = require('./Queue')
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

  queue (queueName, options) {
    return new Queue(this, queueName, options)
  }
}