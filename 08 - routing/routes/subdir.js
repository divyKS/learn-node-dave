// routers for each route are in routes dir
const express = require('express');
// const app = express(); instead of this we make a router
const router = express.Router()
const path = require('path');

// till previous code we didn't handle the routers for the subdir thing

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

router.get('/test(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

module.exports = router; // to use this in server.js