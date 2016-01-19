# OSS in Browser

Play with OSS right in the browser!

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

A sample app server can be found [here][ruby-sts-app-server].


[ruby-sts-app-server]: https://github.com/rockuw/sts-app-server
