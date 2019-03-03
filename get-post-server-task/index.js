const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime/lite');

http.createServer((req, res) => {
  const pathname = decodeURI(url.parse(req.url).pathname);

  switch(req.method) {
    case 'GET':
      if (pathname === '/') {
        fs.readFile(`${__dirname}/public/index.html`, (err, content) => {
          if (err) {
            handleError(err);
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(content);
        });

        return;
      } else if (pathname === '/styles.css') {
        fs.readFile(`${__dirname}/public/styles.css`, (err, content) => {
          if (err) {
            handleError(err);
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/css');
          res.end(content);
        });

        return;
      } else if (pathname !== '/favicon.ico'){
        const filePath = path.normalize(path.join(`${__dirname}/files`, pathname));

        fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) {
            handleError(err, res);
          }

          sendFile(filePath, res);
        });
      }
      break;

    case 'POST':
      let postData = '';

      req.on('data', chunk => {
        postData += chunk;

        // 1MB limit size
        if (postData.length > 1e6) {
          res.statusCode = 413;
          res.end('Too long');
        }
      });

      req.on('end', () => {
        const filePath = path.normalize(path.join(`${__dirname}/files`, pathname));

        if (fs.existsSync(filePath)) {
          res.statusCode = 409;
          res.end('File already exists');
          return;

        } else if (pathname.match(/\.\./) || pathname.substr(1).match(/\//)) {
          res.statusCode = 400;
          res.end('Bad request');
          return;

        } else {
          fs.writeFile(filePath, postData);

          res.statusCode = 200;
          res.end('OK');
        }
      });

      break;

    default:
      res.statusCode = 502;
      res.end('Not implemented');
  }
}).listen(3000);

function handleError(err, res) {
  if (err.code === 'ENOENT') {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  res.statusCode = 500;
  res.end('Internal error');
}

function sendFile(file, res) {
  const fileStream = fs.createReadStream(file);

  const mimeType = mime.getType(file);
  res.setHeader('Content-Type', `${mimeType}; charset=utf-8;`);

  fileStream
    .on('error', err => {
      handleError(err, res);
    })
    .pipe(res)
    .on('close', () => {
      fileStream.destroy();
    });
}