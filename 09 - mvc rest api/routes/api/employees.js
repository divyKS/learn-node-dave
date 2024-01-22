// We separted the logic from our routes into to controller file, this is the MVC pattern

const express = require('express');
const router = express.Router();
// const data = {};
// data.employees = require('../../data/employees.json'); the employee data will also go to the eC.js now
const employeesController = require('../../controllers/employeesController.js');

router.route('/')
    // .get((req, res) => {
    //     res.json(data.employees);
    // }) we will remove all this logic and put it into the employeesController as a function
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;