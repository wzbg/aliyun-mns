/* 
* @Author: zyc
* @Date:   2016-01-23 02:03:47
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 02:19:22
*/
'use strict'

module.exports = class {
  constructor (mns, name, maximumMessageSize) {
    this.mns = mns
    this.name = name
    this.maximumMessageSize = maximumMessageSize
  }

  create (metaoverride, callback) {}

  get (callback) {}

  delete (callback) {}

  list (headers, callback) {}
}