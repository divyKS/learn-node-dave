// pass in as many paramters as you want to 
const verifyRoles = (...allowedRoles) => {
    // you are returning a middleware function
    return (req, res, next) => {
        // if we do not have a reql or if we have a request but not have roles
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        // console.log(rolesArray);
        // console.log(req.roles);
        // if the req has any one the of roles mentioned in the rolesArray then we can access, if there is no role then whole array is false and we cant access any
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles