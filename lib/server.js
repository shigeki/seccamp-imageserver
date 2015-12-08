const http = require('http');
const fs = require('fs');
const port = 8080;
const delay = 3000;

var face = fs.readFileSync('face.png');
var face_stat = fs.statSync('face.png');
var face_cry = fs.readFileSync('face_cry.png');
var face_cry_stat = fs.statSync('face_cry.png');

function outputLog(req) {
  var remoteAddress = req.socket.remoteAddress;
  var now = (new Date()).toString();
  var method = req.method;
  var url = req.url;
  var headers = req.headers;
  var user_agent = headers['user-agent'];
  console.log('LOG:', remoteAddress, now, method, url, user_agent);
}


function sendContent(res, content, length) {
  res.writeHead(200, {
    'content-type': 'image/png',
    'content-length': length,
    'cache-control': 'private, no-cache, no-store, max-age=0, no-transform',
    'pragma': 'no-cache',
    'expires': '0'
  });
  res.end(content);
}


var server = http.createServer(function(req, res) {
  outputLog(req);
  var imagefile_pattern = /face-(\d\d)\.png/;
  var index = imagefile_pattern.exec(req.url);
  var n = (index && index[1]) ? parseInt(index[1]): 1;
  if (n % 3 === 0) {
    setTimeout(function() {
      sendContent(res, face_cry, face_cry_stat.size);
    }, delay);
  } else {
    sendContent(res, face, face_stat.size);
  }
});

server.listen(port, function() {
  console.log('Litening on port ' + port);
});
