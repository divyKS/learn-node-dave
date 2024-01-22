// instead of postman, using thnder client to check the routes of api
const express = require('express');
const router = express.Router()

const data = {};
data.employees = require('../../data/employees.json');

// we can do router.get, router.put, router.post
router.route('/')
    .get( (req, res)=>{
            res.json(data.employees);
        }
    )
    .post(
        // we aren't studying APIs, we are learning about routes
        (req, res)=>{
            res.json({
                "firstname": req.body.firstname,
                "lastname": req.body.lastname
            });
        }
    )
    .put((req, res)=>{
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        })
    })
    .delete((req, res)=>{
        res.json({"id": req.body.id})
        }
    );

// there can be requests with directly parameters in the url, we are handling a get reuest for that
router.route('/:id')
    .get((req, res) => {
        res.json({ "id": req.params.id }); // instead of req.body.id because we are pulling a named parameter directly from the url
    });

module.exports = router;