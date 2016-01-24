/* 
* @Author: zyc
* @Date:   2016-01-23 21:38:40
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:36:05
*/
'use strict'

const mns = require('../mns')

const topic = mns.topic('topic')

topic.get()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

topic.get((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})