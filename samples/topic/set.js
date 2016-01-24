/* 
* @Author: zyc
* @Date:   2016-01-23 21:26:47
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:35:05
*/
'use strict'

const mns = require('../mns')

const topic = mns.topic('topic', {
  MaximumMessageSize: 65536 // 1024(1KB)-65536（64KB）
})

topic.create(true)
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

topic.create(true, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})