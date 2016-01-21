/* 
* @Author: zyc
* @Date:   2016-01-21 02:24:41
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-21 18:52:50
*/
'use strict'

module.exports = class {
  constructor (queue) {
    this.mns = queue.mns
    this.queue = queue
    this.queueName = queue.name
  }

  send () {
    console.log('send')
  }
}