/* 
* @Author: zyc
* @Date:   2016-01-22 22:43:34
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-23 01:27:14
*/
'use strict'

const parser = require('xml2json')
const fetchUrl = require('fetch').fetchUrl

module.exports = (url, options, handle, callback) => new Promise((resolve, reject) => {
  callback = callback || () => {}
  fetchUrl(url, options, (err, res, buf) => {
    if (err) {
      callback(err)
      return reject(err)
    }
    const status = res.status
    const json = parser.toJson(buf.toString(), { object: true })
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