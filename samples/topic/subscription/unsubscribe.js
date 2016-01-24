/* 
* @Author: zyc
* @Date:   2016-01-24 21:43:25
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 22:02:45
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const subscription = topic.subscription('subscribe')

subscription.unsubscribe()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

subscription.unsubscribe((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})