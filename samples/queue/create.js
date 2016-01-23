/* 
* @Author: zyc
* @Date:   2016-01-23 21:09:51
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 21:51:39
*/
'use strict'

const mns = require('../mns')

const queue = mns.queue('queue', {
  DelaySeconds: 0, // 0-604800秒（7天）
  MaximumMessageSize: 65536, // 1024(1KB)-65536（64KB）
  MessageRetentionPeriod: 345600, // 60 (1分钟)-1296000 (15 天)
  VisibilityTimeout: 30, // 1-43200(12小时)
  PollingWaitSeconds: 0, // 0-30秒
})

queue.create()
  .then(res => console.log('promise:', res))
  .catch(err => console.error('promise:', err))

queue.create((err, res) => {
  if (err) return console.error('callback:', err)
  console.log('callback:', res)
})