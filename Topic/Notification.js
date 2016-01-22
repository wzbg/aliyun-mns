/* 
* @Author: zyc
* @Date:   2016-01-23 02:05:01
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 02:24:19
*/
'use strict'

module.exports = class {
  constructor (topic) {
    this.mns = topic.mns
    this.topic = topic
  }

  notifications (callback) {}
}