/* 
* @Author: zyc
* @Date:   2016-01-23 21:38:40
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 21:39:23
*/
'use strict'

const mns = require('../mns')

const queue = mns.queue('queue')

queue.get()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

queue.get((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})