'use strict';

var appServer = '<your STS app server>';
var bucket = 'your bucket name';
var region = 'oss-cn-hangzhou';

var applyToken = function* () {
  var url = appServer;
  var result = yield OSS.urllib.requestThunk(url, {
    method: 'GET'
  });
  return JSON.parse(result.data);
};

var progress = function* (p) {
  var bar = document.getElementById('progress-bar');
  bar.style.width = Math.floor(p * 100) + '%';
  bar.innerHTML = Math.floor(p * 100) + '%';
};

var withStore = function (func) {
  return function () {
    OSS.co(function* () {
      var creds = yield applyToken();
      var store = new OSS({
        region: region,
        accessKeyId: creds.AccessKeyId,
        accessKeySecret: creds.AccessKeySecret,
        stsToken: creds.Security,
        bucket: bucket
      });

      var result = yield func(store);

      console.log(result);
    }).catch(function (err) {
      console.log(err);
    });
  };
};

var uploadFile = function* (store) {
  var file = document.getElementById('file').files[0];
  var key = document.getElementById('object-key-file').value.trim() || 'object';
  console.log(file.name + ' => ' + key);

  var result = yield store.multipartUpload(key, file, {progress: progress});
  yield listFiles(store);

  return result;
};

var uploadContent = function* (store) {
  var content = document.getElementById('file-content').value.trim();
  var key = document.getElementById('object-key-content').value.trim() || 'object';
  console.log('content => ' + key);

  var result = yield store.put(key, new OSS.Buffer(content));
  yield listFiles(store);

  return result;
};

var listFiles = function* (store) {
  var table = document.getElementById('list-files-table');
  console.log('list files');

  var result = yield store.list({
    'max-keys': 100
  });

  var objects = result.objects.sort(function (a, b) {
    var ta = new Date(a.lastModified);
    var tb = new Date(b.lastModified);
    if (ta > tb) return -1;
    if (ta < tb) return 1;
    return 0;
  });

  var numRows = table.rows.length;
  for (var i = 1; i < numRows; i ++) {
    table.deleteRow(table.rows.length - 1);
  }

  for (var i = 0; i < Math.min(3, objects.length); i ++) {
    var row = table.insertRow(table.rows.length);
    row.insertCell(0).innerHTML = objects[i].name;
    row.insertCell(1).innerHTML = objects[i].size;
    row.insertCell(2).innerHTML = objects[i].lastModified;
  }

  return result;
};

var downloadFile = function* (store) {
  var object = document.getElementById('dl-object-key').value.trim();
  var filename = document.getElementById('dl-file-name').value.trim();
  console.log(object + ' => ' + filename);

  var result = store.signatureUrl(object, {
    'content-disposition': 'attachment; filename="' + filename + '"'
  });
  window.location = result;

  return result;
};

window.onload = function () {
  document.getElementById('file-button').onclick = withStore(uploadFile);
  document.getElementById('content-button').onclick = withStore(uploadContent);
  document.getElementById('list-files-button').onclick = withStore(listFiles);
  document.getElementById('dl-button').onclick = withStore(downloadFile);

  withStore(listFiles)();
};
