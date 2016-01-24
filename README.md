# aliyun-mns

> 阿里云 消息服务 非官方 SDK for node.js

**另一个非官方 node.js SDK 请移步至 https://github.com/InCar/ali-mns**

## 使用方法请参照 [官方文档](https://help.aliyun.com/document_detail/mns/api_reference/intro/intro.html)

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

## API
### [队列接口](https://help.aliyun.com/document_detail/mns/api_reference/queue_api_spec/restful_api_intro.html)
[`Queue`](https://help.aliyun.com/document_detail/mns/api_reference/queue_api_spec/queue_operation.html)
  * `constructor (mns, name, options)`
    * `mns` - [REQUIRED] - 使用自己参数初始化的 MNS 对象
    * `name` - [REQUIRED] - 队列名称
    * `options` - [OPTIONAL] - 队列属性
      * `DelaySeconds` - 发送到该 Queue 的所有消息默认将以DelaySeconds参数指定的秒数延后可被消费，单位为秒。 - 0-604800秒（7天）范围内某个整数值，默认值为0
      * `MaximumMessageSize` - 发送到该Queue的消息体的最大长度，单位为byte。 - 1024(1KB)-65536（64KB）范围内的某个整数值，默认值为65536（64KB）。
      * `MessageRetentionPeriod` - 消息在该 Queue 中最长的存活时间，从发送到该队列开始经过此参数指定的时间后，不论消息是否被取出过都将被删除，单位为秒。 - 60 (1分钟)-1296000 (15 天)范围内某个整数值，默认值为345600 (4 天)
      * `VisibilityTimeout` - 消息从该 Queue 中取出后从Active状态变成Inactive状态后的持续时间，单位为秒。 - 1-43200(12小时)范围内的某个值整数值，默认值为30（秒）
      * `PollingWaitSeconds` - 当 Queue 中没有消息时，针对该 Queue 的 ReceiveMessage 请求最长的等待时间，单位为秒。 - 0-30秒范围内的某个整数值，默认值为0（秒）
  * `create (metaoverride, callback)` - [CreateQueue] - 该接口用于创建一个新的队列。队列名称是一个不超过256个字符的字符串，必须以字母或数字为首字符，剩余部分可以包含字母、数字和横划线(-)。当metaoverride=true时该接口[SetQueueAttributes]用于修改消息队列的属性。
  * `delete (callback)` - [DeleteQueue] - 该接口用于删除一个已创建的队列。
  * `get (callback)` - [GetQueueAttributes] - 该接口用于获取某个已创建队列的属性，返回属性除了创建队列时设置的可设置属性外，还可以取到队列创建时间、队列属性修改最后时间以及队列中的各类消息统计数（近似值）。
  * `list (headers, callback)` - [ListQueue] - 该接口用于列出 AccountId 下的队列列表，可分页获取数据。返回结果中只包含 QueueURL 属性，如需进一步获取消息队列的属性可以通过 GetQueueAttributes 接口（详见本文档 GetQueueAttributes 接口）获取。如果只是要获取特定前缀的队列列表，在调用此接口时指定 x-mns-prefix 参数，返回对队列名称的前缀匹配结果。

[`Message`](https://help.aliyun.com/document_detail/mns/api_reference/queue_api_spec/message_operation.html)
  * `constructor (queue)`
    * `queue` - [REQUIRED] - 队列
  * `send (options, callback)` - [SendMessage&BatchSendMessage] - 该接口用于发送消息到指定的队列，普通消息发送到队列随即可被消费者消费。但是如果生产者发送一个消息不想马上被消费者消费（典型的使用场景为定期任务），生产者在发送消息时设置 DelaySeconds 参数就可以达到此目的。发送带 DelaySeconds 参数值大于0的消息初始状态为 Delayed，此时消息不能被消费者消费，只有等 DelaySeconds 时间后消息变成 Active 状态后才可消费。
  * `receive (numOfMessages, waitseconds, callback)` - [ReceiveMessage&BatchReceiveMessage] - 该接口用于消费者消费队列中的消息，ReceiveMessage 操作会将取得的消息状态变成 Inactive，Inactive 的时间长度由 Queue 属性 VisibilityTimeout 指定（详见CreateQueue接口）。 消费者在 VisibilityTimeout 时间内消费成功后需要调用 DeleteMessage 接口删除该消息，否则该消息将会重新变成为 Active 状态，此消息又可被消费者重新消费。
  * `delete (receiptHandle, callback)` - [DeleteMessage&BatchDeleteMessage] - 该接口用于删除已经被消费过的消息，消费者需将上次消费后得到的 ReceiptHandle 作为参数来定位要删除的消息。本操作只有在 NextVisibleTime 之前执行才能成功；如果过了 NextVisibleTime，消息重新变回 Active 状态，ReceiptHandle 就会失效，删除失败，需重新消费获取新的 ReceiptHandle。
  * `peek (numOfMessages, callback)` - [PeekMessage&BatchPeekMessage] - 该接口用于消费者查看消息，PeekMessage 与 ReceiveMessage 不同，PeekMessage 并不会改变消息的状态，即被 PeekMessage 获取消息后消息仍然处于 Active 状态，仍然可被查看或消费；而后者操作成功后消息进入 Inactive ，在 VisibilityTimeout 的时间内不可被查看和消费。
  * `visibility (receiptHandle, visibilityTimeout, callback)` - [ChangeMessageVisibility] - 该接口用于修改被消费过并且还处于的 Inactive 的消息到下次可被消费的时间，成功修改消息的 VisibilityTimeout 后，返回新的 ReceiptHandle。
  * `subscribe (delay, numOfMessages, waitseconds, callback)` - 

### [主题接口](https://help.aliyun.com/document_detail/mns/api_reference/topic_api_spec/restful_api_intro.html)
[`Topic`](https://help.aliyun.com/document_detail/mns/api_reference/topic_api_spec/topic_operation.html)
  * `constructor (mns, name, options)`
    * `mns` - [REQUIRED] - 使用自己参数初始化的 MNS 对象
    * `name` - [REQUIRED] - 主题名称
    * `options` - [OPTIONAL] - 主题属性
      * `MaximumMessageSize` - 发送到该 Topic 的消息体最大长度，单位为Byte - 1024(1KB) - 65536(64KB)范围内的某个整数值，默认值为65536(64KB)
  * `create (metaoverride, callback)` - [CreateTopic] - 该接口用于创建一个新的主题。主题名称是一个不超过256个字符的字符串，必须以字母或数字为首字符，剩余部分可以包含字母、数字和横划线(-)。当metaoverride=true时该接口[SetTopicAttributes]用于修改主题的属性。
  * `delete (callback)` - [DeleteTopic] - 该接口用于删除一个已创建的主题。
  * `get (callback)` - [GetTopicAttributes] - 该接口用于获取某个已创建主题的属性，返回属性除创建主题时的可设置属性外，还可以获取主题的消息最长存活时间、主题创建时间等。
  * `list (headers, callback)` - [ListTopic] - 该接口用于列出帐号下的主题列表，可分页获取数据。如果只是要获取特定的主题列表，在调用接口时指定 x-mns-prefix 参数，服务端将返回主题名称与前缀匹配的主题列表。

[`Message`](https://help.aliyun.com/document_detail/mns/api_reference/topic_api_spec/message_operation.html)
  * `constructor (topic)`
    * `topic` - [REQUIRED] - 主题
  * `publish (options, callback)` - [PublishMessage] - 该接口用于发布者向指定的主题发布消息，消息发布到主题后随即会被推送给 Endpoint 消费。

[`Subscription`](https://help.aliyun.com/document_detail/mns/api_reference/topic_api_spec/subscription_operation.html)
  * `constructor (topic, name, options)`
    * `topic` - [REQUIRED] - 主题
    * `name` - [REQUIRED] - 订阅名称
    * `options` - [REQUIRED] - 订阅属性
      * `Endpoint` - [REQUIRED] - 描述此次订阅中接收消息的终端地址 - 前支持HttpEndpoint，必须以"http://"为前缀
      * `NotifyStrategy` - [OPTIONAL] - 描述了向 Endpoint 推送消息出现错误时的重试策略 - BACKOFF_RETRY 或者 EXPONENTIAL_DECAY_RETRY，默认为BACKOFF_RETRY，重试策略的具体描述请参考 基本概念/NotifyStrategy
      * `NotifyContentFormat` - [OPTIONAL] - 描述了向 Endpoint 推送的消息格式 - XML 或者 SIMPLIFIED，默认为 XML，消息格式的具体描述请参考 基本概念/NotifyContentFormat
  * `subscribe (metaoverride, callback)` - [Subscribe] - 该接口用于订阅主题，创建 Subscription。Subscription 名称是一个不超过 256 个字符的字符串，必须以字母或者数字为首字符，剩余部分可以包含字母、数字和横华线(-)。创建Subscription 时，需要指定对应的 Endpoint，否则不合法，目前支持HttpEndpoint。当metaoverride=true时该接口[SetSubscriptionAttributes]用于修改 Subscription 的属性
  * `unsubscribe (callback)` - [Unsubscribe] - 该接口用于取消一个已创建的 Subscription。
  * `get (callback)` - [GetSubscriptionAttributes] - 该接口用于获取 Subscription 的属性。
  * `list (headers, callback)` - [ListSubscriptionByTopic] - 该接口用于列出某个主题下的 Subscription 列表，可分页获取数据。

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