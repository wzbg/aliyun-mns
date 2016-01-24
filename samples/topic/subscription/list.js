/* 
* @Author: zyc
* @Date:   2016-01-24 21:43:46
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:59:57
*/
'use strict'

const mns = require('../../mns')

const topic = mns.topic('topic')
const subscription = topic.subscription('subscribe')

// subscription.list()
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))

// subscription.list((err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })

const headers = {
  'x-mns-ret-number': 2,
  'x-mns-prefix': 'subscribe'
}

subscription.list(headers)
  .then(res => {
    console.log('promise:', res)
    const nextMarker = res.nextMarker
    if (nextMarker) {
      headers['x-mns-marker'] = nextMarker
      subscription.list(headers)
        .then(res => console.log('promise2:', res))
        .catch(err => console.error('promise2:', err))
    }
  })
  .catch(err => console.error('promise:', err))

subscription.list(headers, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
  const nextMarker = res.nextMarker
  if (nextMarker) {
    headers['x-mns-marker'] = nextMarker
    subscription.list(headers, (err, res) => {
      if (err) return console.error('callback2:', err)
      console.log('callback2:', res)
    })
  }
})