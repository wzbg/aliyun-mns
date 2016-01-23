/* 
* @Author: zyc
* @Date:   2016-01-23 21:26:47
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 21:36:12
*/
'use strict'

const mns = require('../mns')

const queue = mns.queue('queue', {
  DelaySeconds: 604800, // 0-604800秒（7天）
  MaximumMessageSize: 65536, // 1024(1KB)-65536（64KB）
  MessageRetentionPeriod: 1296000, // 60 (1分钟)-1296000 (15 天)
  VisibilityTimeout: 43200, // 1-43200(12小时)
  PollingWaitSeconds: 30, // 0-30秒
})

queue.create(true)
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

queue.create(true, (err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})