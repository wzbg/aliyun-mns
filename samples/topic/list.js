/* 
* @Author: zyc
* @Date:   2016-01-23 21:44:05
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 21:40:28
*/
'use strict'

const mns = require('../mns')

const topic = mns.topic()

// topic.list()
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))

// topic.list((err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })

const headers = {
  'x-mns-ret-number': 2,
  'x-mns-prefix': 'topic'
}

topic.list(headers)
  .then(res => {
    console.log('promise:', res)
    const nextMarker = res.nextMarker
    if (nextMarker) {
      headers['x-mns-marker'] = nextMarker
      topic.list(headers)
        .then(res => console.log('promise2:', res))
        .catch(err => console.error('promise2:', err))
    }
  })
  .catch(err => console.error('promise:', err))

topic.list(headers, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
  const nextMarker = res.nextMarker
  if (nextMarker) {
    headers['x-mns-marker'] = nextMarker
    topic.list(headers, (err, res) => {
      if (err) return console.error('callback2:', err)
      console.log('callback2:', res)
    })
  }
})