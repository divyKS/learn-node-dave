const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const verifyJWT = require('../../middleware/verifyJWT')

router.route('/')
    // we can pass middleware before the function so it will ifrst go the verifyJWT middleware
    // if we want to protect just some routes only then this is good way, otherwise we will add the JWT auth in the server.js file 
    // .get(verifyJWT, employeesController.getAllEmployees)
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;