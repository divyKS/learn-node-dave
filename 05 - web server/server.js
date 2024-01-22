const fs = require('fs');
const path = require('path');
const http = require('http');
const fsPromise = require('fs').promises;


const logEvents = require('./logEvents');
const EventEmitter = require('events') ;
class EmitterMaker extends EventEmitter{};
const myEmitter = new EmitterMaker(); 

myEmitter.on('log', (msg, fileName)=>logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;


const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromise.readFile(
            filePath, 
            contentType.includes('image')? '': 'utf8'
        );

        const data = contentType === 'application/json' ? JSON.parse(rawData): rawData;

        response.writeHead(
            filePath.includes('404.html')? 404:200, 
            {'Content-Type': contentType}
        );

        response.end(
            contentType === 'application/json'? JSON.stringify(data): data
        );

    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.method}\t${err.message}`, 'errLog.txt');
        response.statusCode = 500; // server error
        response.end();
    }
}


const server = http.createServer( (req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    // Finding path of the requested resource
    let filePath = contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);


    /*
    Not efficeint 

    setHeader() -> additional information in response  "Content-Type", "Content-Length", "Cache-Control"...
    
    let filePath;
    if(req.url === '/' || req.url === 'index.html'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        filePath = path.join(__dirname, 'view', 'index.html');
        fs.readFile(filePath, 'utf8', (err, data)=>{
            res.end(data);
        })
    }

    */
   
    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        // requested file does not exist: redirect 301 or not found 404.
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
                /*
                
                setHeader() and writeHead() set the HTTP response header

                writeHead() sets response status code and headers in one method call

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                });

                vs

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-cache');

                */
  
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);

        }
        console.log(path.parse(filePath));
    }

});

// this is not an event listener, this is used to start a server
server.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});