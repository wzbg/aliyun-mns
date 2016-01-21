/* 
* @Author: zyc
* @Date:   2016-01-20 11:50:39
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 15:32:29
*/
'use strict'

const assert = require('assert')
const crypto = require('crypto')

module.exports = class {
  constructor (AccessKeySecret, XMnsVersion) {
    this.AccessKeySecret = AccessKeySecret
    this.XMnsVersion = XMnsVersion
  }

  sign (options) {
    const { VERB, CanonicalizedResource } = options
    assert.ok(VERB, 'VERB required')
    assert.ok(CanonicalizedResource, 'CanonicalizedResource required')
    let { CONTENT_MD5, CONTENT_TYPE, CanonicalizedMNSHeaders } = options
    CONTENT_MD5 = CONTENT_MD5 || ''
    CONTENT_TYPE = CONTENT_TYPE || ''
    const DATE = new Date().toGMTString()
    CanonicalizedMNSHeaders = CanonicalizedMNSHeaders || 'x-mns-version:' + this.XMnsVersion
    const signature = `${VERB}\n${CONTENT_MD5}\n${CONTENT_TYPE}\n${DATE}\n${CanonicalizedMNSHeaders}\n${CanonicalizedResource}`
    const hmac = crypto.createHmac('sha1', this.AccessKeySecret)
    hmac.update(signature)
    return { DATE, Signature: hmac.digest().toString('base64') }
  }
}