const express = require('express');
const app = express();
const path = require('path');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;
const cors = require('cors');

// custom middleware logger
app.use(logger);

//third party middle ware -> 'CORS' Cross Origin Resource Sharing
// app.use(cors()); // writing this atleast just removes that cors error, if we are going to use a public api or something then it is fine but we might not want to do it like this
// whatever website will access this backend that we can put here
const whitelist = ['https://127.0.0.1:5500', 'http://localhost:3500', 'https://www.yoursite.com', 'https://www.google.com'];
const corsOptions = {
    origin: (origin, callback)=>{
        // these two origin are diff, the origin in parameter is from the side that requested this backend
        if(whitelist.indexOf(origin) != -1 || !origin){//no origin for the undefined thing in logs, to be done when devloping
            callback(null, true); // null is where we were to put the error
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data in other words, form data: ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
//built-in middle for serve static files, this give all the css and now the pages have css, so in out html files we should change thr href for the css files
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!');
});

// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}
app.get('/chain(.html)?', [one, two, three]);

// we could use app.use('/') but it does not take regex and we it them for middleware
// app.get('/*', (req, res)=>{
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

// app.all is used for routing, applies to all http methods, and can have regex
// app.all('*', (req, res)=>{
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });
app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: '404 not found'}); // will need postman to test out these two
    } else {
        res.type('txt').send('404 not found');
    }
});

// express has its kind of error handling but in the very end because of the waterfall we should can make our own error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));