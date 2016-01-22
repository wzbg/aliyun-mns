/* 
* @Author: zyc
* @Date:   2016-01-23 02:04:04
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 02:26:18
*/
'use strict'

module.exports = class {
  constructor (topic) {
    this.mns = topic.mns
    this.topic = topic
  }

  subscribe (metaoverride, callback) {}

  get (callback) {}

  unsubscribe (callback) {}

  list (headers, callback) {}
}