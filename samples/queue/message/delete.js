/* 
* @Author: zyc
* @Date:   2016-01-24 01:13:32
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 01:45:52
*/
'use strict'

const mns = require('../../mns')

const queue = mns.queue('queue')
const message = queue.message()

message.receive()
  .then(res => {
    console.log('promise:', res)
    message.delete(res.ReceiptHandle)
      .then(res => console.log('promise:', res))
      .catch(err => console.error('promise:', err))
  })
  .catch(err => console.error('promise:', err))
message.receive((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
  message.delete(res.ReceiptHandle, (err, res) => {
    if (err) return console.error('callback:', err)
    console.log('callback:', res)
  })
})

// batch
// message.receive(2)
//   .then(res => {
//     console.log('promise:', res)
//     message.delete(res.map(msg => msg.ReceiptHandle))
//       .then(res => console.log('promise:', res))
//       .catch(err => console.error('promise:', err))
//   })
//   .catch(err => console.error('promise:', err))
// message.receive(2, (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
//   message.delete(res.map(msg => msg.ReceiptHandle), (err, res) => {
//     if (err) return console.error('callback:', err)
//     console.log('callback:', res)
//   })
// })