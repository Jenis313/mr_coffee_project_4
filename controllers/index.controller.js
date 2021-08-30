const express = require('express');
const router = express.Router();

const isLoggedIn = true;
router.get('/', (req, res, next) => {
    if(!isLoggedIn){
        res.redirect('/login');
    }
    // Render Schedules
    res.render('pages/index.ejs');
})

module.exports = router;