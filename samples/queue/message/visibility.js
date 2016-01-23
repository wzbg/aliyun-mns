/* 
* @Author: zyc
* @Date:   2016-01-23 23:58:25
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 01:11:51
*/
'use strict'

const mns = require('../../mns')

const queue = mns.queue('queue')
const message = queue.message()

message.receive()
  .then(res => {
    console.log('promise:', res)
    message.visibility(res.ReceiptHandle, 50)
      .then(res => console.log('promise:', res))
      .catch(err => console.error('promise:', err))
  })
  .catch(err => console.error('promise:', err))
message.receive((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
  message.visibility(res.ReceiptHandle, 50, (err, res) => {
    if (err) return console.error('callback:', err)
    console.log('callback:', res)
  })
})