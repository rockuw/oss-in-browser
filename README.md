# OSS in Browser

Play with OSS right in the browser!

![Demo](screenshot.png?raw=true "OSS in Browser")

## Browser support

- IE >= 10 & Edge
- Major versions of Chrome/Firefox/Safari
- Major versions of Android/iOS/WP

## Setup

### Bucket setup

As browser-side javascript involves CORS operations. You need to setup
your bucket CORS rules to allow CORS operations:

- set allowed origins to '*'
- allowed methods to 'PUT, GET, POST, DELETE, HEAD'
- set allowed headers to '*'
- expose 'ETag' in expose headers

### STS setup

As we don't want to expose the accessKeyId/accessKeySecret in the
browser, a [common practice][oss-sts] is to use STS to grant temporary
access.

### App setup

Fill in your appServer address and bucket name in `app.js`:

```js
var appServer = '<your STS app server>';
var bucket = '<your bucket name>';
var region = 'oss-cn-hangzhou';
```

And then open `index.html` in your browser.

### STS App server

A sample app server can be found [here][node-sts-app-server].

### IE Compatibility

You may need include the promise polyfill for IE:

```html
<script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
```


[node-sts-app-server]: https://github.com/rockuw/node-sts-app-server
[oss-sts]: https://help.aliyun.com/document_detail/oss/practice/ram_guide.html
