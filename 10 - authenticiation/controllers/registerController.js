// setting up like use state in react
// creating a user database object for the same
const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data){this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
// bcrypt to hash and salt the passwords that come in
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    // async for bcrypt usage
    // destructuring the req because it is going to have the user and the password
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message": "Both user and password are needed"});

    // check if this new user is going to cause duplicacy
    const duplicate = userDB.users.find((person)=>person.username === user);
    
    if(duplicate) return res.sendStatus(409); // code for conflict, we have to put return here since we dont want the code after the if the exexcute if there are duplicates, return ensures control exiting the current handler scope
    // sendStatus sents the status code and the status message, it is same as doing status(409).send("Conflict")

    try {   
        // hashing, 10 is the salt rounds and that is the default
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username": user,
            "password": hashedPwd
        };
        // we are working with immuatable data, instead of adding to existing array, we are going to create a new one, like state in react

        userDB.setUsers(...userDB.users, newUser);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'), 
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users)
        res.status(201).send("new users created");

    } catch (err){
        res.status(500).json({"message": err.message});
    }
}

module.exports = { handleNewUser };