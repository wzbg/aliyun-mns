/* 
* @Author: zyc
* @Date:   2016-01-24 22:02:19
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 22:06:39
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const message = topic.message()

message.publish('message')
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))
message.publish('message', (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})

// message.publish({ MessageBody: 'message' })
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))
// message.publish({ MessageBody: 'message' }, (err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })