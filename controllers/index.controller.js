const express = require('express');
const router = express.Router();
const db = require('./../models/db')

router.get('/', (req, res, next) => {
    // Render Schedules
    // res.render('pages/index.ejs');
    db.any("SELECT * FROM users INNER JOIN schedules ON schedules.user_id = users.id")
        .then((data) => {
            // res.json(data);
            // console.log(data);
            res.render('./pages/index.ejs',{
                data
            })
        })
        .catch((err) => {
            next(err);
        })
})

module.exports = router;