# aliyun-mns

> 阿里云 消息服务 非官方 SDK for node.js

**另一个非官方 node.js SDK 请移步 https://github.com/InCar/ali-mns**

## 技术支持
请发邮件至：yecheng@amandapp.com

## 初始化
```javascript
const MNS = require('aliyun-mns')
const mns = new MNS({
  accessKeyId: '[在阿里云申请的 accessKeyId]',
  secretAccessKey: '[在阿里云申请的 secretAccessKey]',
  endpoint: 'http://[账号ID].mns.[区域](-internal)(-vpc).aliyuncs.com',
  apiVersion: '2015-06-06' // 调用MNS接口的版本号，当前版本为2015-06-06
})
```

## 安装
### Node.js 安装
```sh
npm install aliyun-mns
```

## 使用方法及代码示例
### 队列接口
在 samples/queue 目录下的代码示例，使用方法：
 - 将 sample/mns.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 create.js，将其中的参数改成你自己的 queue 实例参数
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/queue
 node --harmony_destructuring create
 ```

### 主题接口
在 samples/topic 目录下的代码示例，使用方法：
 - 将 sample/mns.js 中需要的参数修改
 - 打开需要执行的某个实例文件，如 create.js，将其中的参数改成你自己的 topic 实例参数
 - 执行示例文件即可, 如:

 ```javascript
 cd samples/topic
 node --harmony_destructuring create
 ```

## 贡献者

https://github.com/wzbg/aliyun-mns

## 依赖
- [`fetch`](https://www.npmjs.com/package/fetch) - Fetch url contents. Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
- [`data2xml`](https://www.npmjs.com/package/data2xml) - A data to XML converter with a nice interface (for NodeJS).
- [`xml2json`](https://www.npmjs.com/package/xml2json) - Converts xml to json and vice-versa, using node-expat.

#### 我们在代码中参考了 ALIYUN SDK，在此声明。

## License
The MIT License (MIT)

Copyright (c) 2016