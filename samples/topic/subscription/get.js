/* 
* @Author: zyc
* @Date:   2016-01-24 21:43:39
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:56:52
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const subscription = topic.subscription('subscribe')

subscription.get()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

subscription.get((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})