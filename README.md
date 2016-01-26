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

- include your domain in allowed origins
- include your HTTP methods in allowed methods
- include 'x-oss-date' and 'Authorization' in allowed headers
- expose 'ETag' in expose headers

### STS setup

As we don't want to expose the accessKeyId/accessKeySecret in the
browser, a [common practice][oss-sts] is to use STS to grant temporary
access.

### App setup

Fill in your appServer address and bucket name in `app-babel.js`:

```js
var appServer = '<your STS app server>';
var bucket = '<your bucket name>';
var region = 'oss-cn-hangzhou';
```

And then open `index.html` in your browser.

### Develop

If you want to make some changes in `app.js`, just go ahead using the
awesome ES6 grammar. Before running the app you need some extra work:

If you're using major versions of Chrome or Firefox, just change
`app-babel.js` to `app.js` in this line of `index.html`:

```html
<script type="text/javascript" src="app-babel.js"></script>
```

and fill in your STS app server and bucket name, then open
`index.html` in your browser and there you are.

If you want more compatibility, use `babel` to transform `app.js` into
`app-babel.js`, before this you must fill in your configurations in
`app.js` first.

```bash
npm install -g browserify
npm install --save-dev babelify
npm install babel-preset-es2015 --save-dev
echo '{ "presets": ["es2015"] }' > .babelrc
browserify app.js -t babelify > app-babel.js
```

After that, open `index.html` in your browser and there you go.

### STS App server

A sample app server can be found [here][node-sts-app-server].


[node-sts-app-server]: https://github.com/rockuw/node-sts-app-server
[oss-sts]: https://help.aliyun.com/document_detail/oss/practice/ram_guide.html
