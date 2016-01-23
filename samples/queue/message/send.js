/* 
* @Author: zyc
* @Date:   2016-01-23 21:57:53
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 23:28:23
*/
'use strict'

const mns = require('../../mns')

const queue = mns.queue('queue')
const message = queue.message()

message.send('message')
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))
message.send('message', (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})

// const msg = {
//   MessageBody: 'message',
//   DelaySeconds: 60,
//   Priority: 1,
// }
// message.send(msg)
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))
// message.send(msg, (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })

// batch
// message.send(['message1', 'message2'])
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))
// message.send(['message1', 'message2'], (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })

// const msgs = [{
//   MessageBody: 'message1',
//   DelaySeconds: 60,
//   Priority: 1,
// }, {
//   MessageBody: 'message2',
//   DelaySeconds: 60,
//   Priority: 1,
// }]
// message.send(msgs)
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))
// message.send(msgs, (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })