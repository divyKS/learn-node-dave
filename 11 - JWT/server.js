const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;


app.use(logger);
app.use(credentials()); // to be chekced before cors and fetch cookies crdentials reuirements
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(cookieParser()); // for the cookie thing
app.use('/', express.static(path.join(__dirname, '/public')));


app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh')); // the refresh jwt has to be before the verifyJWT
app.use('/logout', require('./routes/logout')); // the logout can also be before the verifyJWT
app.use(verifyJWT); // like this we would add here, and since it works like a waterfall so everything below this will do the auth
app.use('/employees', require('./routes/api/employees'));


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