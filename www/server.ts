
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as livereload from "livereload";

http.createServer(function handleRequest(request, response) {
    let url = request.url || "/";
    console.log(`handleRequest - url [${url}]`);

    if(url[0] === '~') {
        url = url.substring(1) || "/";
    }

    if(url.length >= 2 &&  url[0] === '/' && url[1] === '~') {
        url = url.substring(2) || "/";
    }
    
    let filePath = '.' + url;
    if (filePath == './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes: any = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');


const lrserver = livereload.createServer();
lrserver.watch(__dirname);
console.log('Livereload server running at port: 35729');