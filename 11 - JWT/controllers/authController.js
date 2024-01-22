const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = usersDB.users.find(person => person.username === user);
    //foundUser is the user that is logging in
    if (!foundUser) return res.status(401).send("Eror here for some reason"); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs to protect routes
        const accessToken = jwt.sign(
            //first thing to pass is payload, dont use pass bcz it will be available if token is found
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user in the database so that we can create a log out route and at that time invaliadte the refresh token when user logs out if he does before the refresh token time
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // jwt is cookie name here
        // secure: true, 
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });// same site none for those errors in the end  and secure must be set true here , now yes you have to put this even in dev server which is using http
        // we dont want our access token to be saved anywhere in cookie or aything so we are sending it is json, but we wont send refresh token with it here, we dont the refresh token to be saved too otherwise the user can gain infinite time access so we will send it is http only cookie, http only cookie is not available to javascript so it is safe, for frontend devs it creates problem if we send refresh token as json because we do want it to be saved but we dont want to save it at a place accessible by JS so we have to send it as http aookie and not as json
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };