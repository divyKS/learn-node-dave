const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) { // if the origin that is sending request is in the allowedORigins
        res.header('Access-Control-Allow-Credentials', true); // then set this header to be ture, because that is what cors is looking for
    }
    next();
}

module.exports = credentials