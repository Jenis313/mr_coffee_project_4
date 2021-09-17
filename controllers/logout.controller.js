const express = require('express');
const router = express.Router();

// Logout Router
router.get('/', (req, res, next) => {
    console.log('Hit this url')
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/auth/login');
})
module.exports = router;