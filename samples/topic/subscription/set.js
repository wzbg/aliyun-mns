/* 
* @Author: zyc
* @Date:   2016-01-24 21:43:12
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:55:40
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const subscription = topic.subscription('subscribe', {
  NotifyStrategy: 'EXPONENTIAL_DECAY_RETRY',
  NotifyContentFormat: 'XML'
})

subscription.subscribe(true)
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

subscription.subscribe(true, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})