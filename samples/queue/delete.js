/* 
* @Author: zyc
* @Date:   2016-01-23 21:32:05
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 21:59:02
*/
'use strict'

const mns = require('../mns')

const queue = mns.queue('queue')

queue.delete()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

queue.delete((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})