

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // checking if we even recieved it
    if (!authHeader) return res.sendStatus(401);//unauthorized
    console.log(authHeader); // Bearer token 
    const token = authHeader.split(' ')[1]; // the token is after the space
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,//accessing it again since this is what we will verify
        (err, decoded) => {
            if (err) return res.sendStatus(403); //forbidden, we recieved a token but it had been tampered with somehow, so invalid token
            req.user = decoded.username; // this is that username that we passed to the jwt in the auth controller
            next();
        }
    );
}

module.exports = verifyJWT