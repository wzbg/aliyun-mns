/* 
* @Author: zyc
* @Date:   2016-01-20 23:16:03
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 02:21:51
*/
'use strict'

const assert = require('assert')
const convert = require('data2xml')()
const fetchUrl = require('fetch').fetchUrl

module.exports = class {
  constructor (mns, name, options) {
    assert.ok(name, 'name required')
    this.mns = mns
    this.name = name
    this.options = options || {}
  }

  create () {
    const method = 'PUT'
    const URI = `/queues/${this.name}`
    const { DATE, Authorization } = this.mns.authorization({ VERB: method, CanonicalizedResource: URI })
    const options = this.options || {}
    options._attr = { xmlns: 'http://mns.aliyuncs.com/doc/v1/' }
    fetchUrl(this.mns.Endpoint + URI, {
      method,
      headers: {
        Date: DATE,
        Authorization,
        'x-mns-version': this.mns.XMnsVersion
      },
      payload: convert('Queue', options)
    }, (err, res, buf) => {
      console.log(buf.toString())
    })
  }
}