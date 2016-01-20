/* 
* @Author: zyc
* @Date:   2016-01-20 13:17:37
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-20 22:24:59
*/
'use strict'

const fetchUrl = require('fetch').fetchUrl

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
    fetchUrl(this.Endpoint + URI, {
      method,
      headers: {
        Date: DATE,
        Authorization,
        'x-mns-version': this.XMnsVersion
      }
    }, (err, res, buf) => {
      console.log(buf.toString())
    })
  }
}