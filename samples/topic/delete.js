/* 
* @Author: zyc
* @Date:   2016-01-23 21:32:05
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:42:06
*/
'use strict'

const mns = require('../mns')

const topic = mns.topic('topic')

topic.delete()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

topic.delete((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})