/* 
* @Author: zyc
* @Date:   2016-01-24 01:48:05
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-28 01:41:01
*/
'use strict'

const mns = require('../../mns')

const queue = mns.queue('queue')
const message = queue.message()

message.subscribe((err, msg, ack) => {
  if (err) console.error(err)
  else console.log(msg)
  ack()
})

// message.subscribe(3, (err, msg, ack) => {
//   if (err) console.error(err)
//   else console.log(msg)
//   ack()
// })

// message.subscribe(3, 2, (err, msg, ack) => {
//   if (err) console.error(err)
//   else console.log(msg)
//   ack()
// })

// message.subscribe(3, 2, 1, (err, msg, ack) => {
//   if (err) console.error(err)
//   else console.log(msg)
//   ack()
// })