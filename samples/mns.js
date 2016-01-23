/* 
* @Author: zyc
* @Date:   2016-01-23 20:48:55
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-24 02:29:50
*/
'use strict'

const MNS = require('../index')

module.exports = new MNS({
  accessKeyId: '[在阿里云申请的 accessKeyId]',
  secretAccessKey: '[在阿里云申请的 secretAccessKey]',
  endpoint: 'http://[账号ID].mns.[区域](-internal)(-vpc).aliyuncs.com',
  apiVersion: '2015-06-06' // 调用MNS接口的版本号，当前版本为2015-06-06
})