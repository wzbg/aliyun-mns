/* 
* @Author: zyc
* @Date:   2016-01-23 23:54:25
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 01:45:56
*/
'use strict'

const mns = require('../../mns')

const queue = mns.queue('queue')
const message = queue.message()

message.peek()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))
message.peek((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})

// batch
// message.peek(2)
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))
// message.peek(2, (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })