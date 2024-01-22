const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken -> do this on the frontend, this can't be done with the backend

    // we can with backend take care of the refresh token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content, if the RT doesn't exits, its wonderful
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        // we didn't find the user but did have a cookie to reach this point
        // , secure: true 
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'}); // pass in the same options as before, the max age need not to be in here that can be expected
        return res.sendStatus(204); // success but no content
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' }; 
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    // , secure: true 
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'}); // max age we also wrote, so that has to be done here too, secure ture isn't done in dev envrionment since we use httpp, secure ture makes it serve only on https
    res.sendStatus(204);
}

module.exports = { handleLogout }