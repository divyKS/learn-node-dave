const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;
const cors = require('cors');

app.use(logger);

const whitelist = ['https://127.0.0.1:5500', 'http://localhost:3500', 'https://www.yoursite.com', 'https://www.google.com'];
const corsOptions = {
    origin: (origin, callback)=>{
        if(whitelist.indexOf(origin) != -1 || !origin){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serer static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public'))); // we didn't tell express to use the css available in public dir for the files of subdir 


// routes
app.use('/', require('./routes/root.js'));
app.use('/subdir', require('./routes/subdir.js'));
app.use('/employees', require('./routes/api/employees.js'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));