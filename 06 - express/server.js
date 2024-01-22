const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3500;

// we can do regex with url, start with / end with / or index.html => ^/$|index.html to make .html optional (.html)?
app.get('^/$|/index(.html)?', (req, res)=>{
    // res.send('Hello World');
    // res.sendFile('./views/index.html', {root: __dirname}); // look for the path inside the root
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res)=>{
    res.redirect(301, '/new-page.html'); // it will send a status code but it will be 302 by default, so to send 301 we should write it
});

// route handlers
app.get('/hello(.html)?', (req, res, next)=>{
    console.log('attempted reloading hello.html, now going to use the next to call the next function in the chain');
    next();
}, (req, res)=>{
    res.send('hello world');
});

// the more common way of doing chaining is below
const one = (req, res, next) => {
    console.log('one');
    next();
};
const two = (req, res, next) => {
    console.log('two');
    next();
};

const three = (req, res) => {
    console.log('three');
    res.send('finished');
};

app.get('/chain(.html)?', [one, two, three]);

// these route handlers work in a very similar way of middle-wares

app.get('/*', (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));