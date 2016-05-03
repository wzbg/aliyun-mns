/* 
* @Author: zyc
* @Date:   2016-01-22 22:43:34
* @Last Modified by:   zyc
* @Last Modified time: 2016-05-03 17:58:58
*/
'use strict'

const parser = require('xml2json')
const request = require('request')

module.exports = (url, options, handle, callback) => new Promise((resolve, reject) => {
  if (!callback) callback = () => {}
  request(url, options, (err, res, body) => {
    if (err) {
      callback(err)
      return reject(err)
    }
    const status = res.statusCode
    const json = parser.toJson(body, { object: true })
    if (json.Errors) json.Error = json.Errors.Error
    if (json.Error) {
      json.Error.status = status
      callback(json.Error)
      return reject(json.Error)
    }
    const data = handle(json, res)
    callback(null, data)
    resolve(data)
  })
})