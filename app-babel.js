(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var appServer = '<your STS app server>';
var bucket = '<your bucket name>';
var region = 'oss-cn-hangzhou';

var applyToken = regeneratorRuntime.mark(function applyToken() {
  var url, result;
  return regeneratorRuntime.wrap(function applyToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = appServer;
          _context.next = 3;
          return OSS.urllib.requestThunk(url, {
            method: 'GET'
          });

        case 3:
          result = _context.sent;
          return _context.abrupt('return', JSON.parse(result.data));

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, applyToken, this);
});

var progress = regeneratorRuntime.mark(function progress(p) {
  var bar;
  return regeneratorRuntime.wrap(function progress$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          bar = document.getElementById('progress-bar');

          bar.style.width = Math.floor(p * 100) + '%';
          bar.innerHTML = Math.floor(p * 100) + '%';

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  }, progress, this);
});

var withStore = function withStore(func) {
  return function () {
    OSS.co(regeneratorRuntime.mark(function _callee() {
      var creds, store, result;
      return regeneratorRuntime.wrap(function _callee$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return applyToken();

            case 2:
              creds = _context3.sent;
              store = new OSS({
                region: region,
                accessKeyId: creds.AccessKeyId,
                accessKeySecret: creds.AccessKeySecret,
                stsToken: creds.Security,
                bucket: bucket
              });
              _context3.next = 6;
              return func(store);

            case 6:
              result = _context3.sent;

              console.log(result);

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee, this);
    })).then(function () {
      // pass
    }).catch(function (err) {
      console.log(err);
    });
  };
};

var uploadFile = regeneratorRuntime.mark(function uploadFile(store) {
  var file, key, result;
  return regeneratorRuntime.wrap(function uploadFile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          file = document.getElementById('file').files[0];
          key = document.getElementById('object-key-file').value.trim() || 'object';

          console.log(file.name + ' => ' + key);

          _context4.next = 5;
          return store.multipartUpload(key, file, { progress: progress });

        case 5:
          result = _context4.sent;
          _context4.next = 8;
          return listFiles(store);

        case 8:
          return _context4.abrupt('return', result);

        case 9:
        case 'end':
          return _context4.stop();
      }
    }
  }, uploadFile, this);
});

var uploadContent = regeneratorRuntime.mark(function uploadContent(store) {
  var content, key, data, result;
  return regeneratorRuntime.wrap(function uploadContent$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          content = document.getElementById('file-content').value.trim();
          key = document.getElementById('object-key-content').value.trim() || 'object';

          console.log('content => ' + key);

          data = {
            content: content,
            size: content.length
          };
          _context5.next = 6;
          return store.putData(key, data);

        case 6:
          result = _context5.sent;
          _context5.next = 9;
          return listFiles(store);

        case 9:
          return _context5.abrupt('return', result);

        case 10:
        case 'end':
          return _context5.stop();
      }
    }
  }, uploadContent, this);
});

var listFiles = regeneratorRuntime.mark(function listFiles(store) {
  var table, result, objects, numRows, i, row;
  return regeneratorRuntime.wrap(function listFiles$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          table = document.getElementById('list-files-table');

          console.log('list files');

          _context6.next = 4;
          return store.list({
            'max-keys': 100
          });

        case 4:
          result = _context6.sent;
          objects = result.objects.sort(function (a, b) {
            var ta = new Date(a.lastModified);
            var tb = new Date(b.lastModified);
            if (ta > tb) return -1;
            if (ta < tb) return 1;
            return 0;
          });
          numRows = table.rows.length;

          for (i = 1; i < numRows; i++) {
            table.deleteRow(table.rows.length - 1);
          }

          for (i = 0; i < Math.min(3, objects.length); i++) {
            row = table.insertRow(table.rows.length);

            row.insertCell(0).innerHTML = objects[i].name;
            row.insertCell(1).innerHTML = objects[i].size;
            row.insertCell(2).innerHTML = objects[i].lastModified;
          }

          return _context6.abrupt('return', result);

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, listFiles, this);
});

var downloadFile = regeneratorRuntime.mark(function downloadFile(store) {
  var object, filename, result;
  return regeneratorRuntime.wrap(function downloadFile$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          object = document.getElementById('dl-object-key').value.trim();
          filename = document.getElementById('dl-file-name').value.trim();

          console.log(object + ' => ' + filename);

          result = store.signatureUrl(object, {
            'content-disposition': 'attachment; filename="' + filename + '"'
          });

          window.location = result;

          return _context7.abrupt('return', result);

        case 6:
        case 'end':
          return _context7.stop();
      }
    }
  }, downloadFile, this);
});

window.onload = function () {
  document.getElementById('file-button').onclick = withStore(uploadFile);
  document.getElementById('content-button').onclick = withStore(uploadContent);
  document.getElementById('list-files-button').onclick = withStore(listFiles);
  document.getElementById('dl-button').onclick = withStore(downloadFile);

  withStore(listFiles)();
};

},{}]},{},[1]);
