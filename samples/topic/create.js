/* 
* @Author: zyc
* @Date:   2016-01-23 21:09:51
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:40:49
*/
'use strict'

const mns = require('../mns')

const topic = mns.topic('topic', {
  MaximumMessageSize: 65536 // 1024(1KB)-65536（64KB）
})

topic.create()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

topic.create((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})