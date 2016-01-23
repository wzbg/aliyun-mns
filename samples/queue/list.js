/* 
* @Author: zyc
* @Date:   2016-01-23 21:44:05
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 21:55:44
*/
'use strict'

const mns = require('../mns')

const queue = mns.queue()

// queue.list()
//   .then(res => console.log('promise:', res))
//   .catch(err => console.error('promise:', err))

// queue.list((err, res) => {
//   if (err) return console.error('callback:', err)
//   console.log('callback:', res)
// })

const headers = {
  'x-mns-ret-number': 2,
  'x-mns-prefix': 'queue'
}

queue.list(headers)
  .then(res => {
    console.log('promise:', res)
    const nextMarker = res.nextMarker
    if (nextMarker) {
      headers['x-mns-marker'] = nextMarker
      queue.list(headers)
        .then(res => console.log('promise2:', res))
        .catch(err => console.error('promise2:', err))
    }
  })
  .catch(err => console.error('promise:', err))

queue.list(headers, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
  const nextMarker = res.nextMarker
  if (nextMarker) {
    headers['x-mns-marker'] = nextMarker
    queue.list(headers, (err, res) => {
      if (err) return console.error('callback2:', err)
      console.log('callback2:', res)
    })
  }
})