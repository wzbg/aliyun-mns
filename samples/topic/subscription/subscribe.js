/* 
* @Author: zyc
* @Date:   2016-01-24 21:43:06
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 22:00:28
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const subscription = topic.subscription('subscribe', {
  Endpoint: 'http://company.com',
  NotifyStrategy: 'BACKOFF_RETRY',
  NotifyContentFormat: 'SIMPLIFIED'
})

subscription.subscribe()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

subscription.subscribe((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})