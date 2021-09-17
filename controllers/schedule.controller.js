var express = require('express');
var router = express.Router();
const db = require('./../models/db')

router.route('/')
    .get((req, res, next) => {
        // res.send('rendered add new schedule form')
        // render form to add a new schedule for loggedin user and all the schedules of the logged in user
        const user_id = req.currentUser.id; 
        db.any("SELECT * FROM users INNER JOIN schedules ON schedules.user_id = users.id WHERE user_id = $1", user_id)
        .then((data) => {
            // console.log(data);
            // res.json(data);
            res.render('./pages/manage-schedule.ejs', {
                message : req.query.message,
                schedules: data
            })
        })
        .catch((err) => {
            next(err);
        })
        
    })
    .post((req, res, next) => {
        console.log(req.body)
        // Insert new schedule of logged in user
        const {day, start_time, end_time} = req.body;
        const user_id = req.currentUser.id; 
        db.none("INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4)", [user_id, day, start_time, end_time])
            .then(() => {
                // res.redirect('/new');
                res.redirect('/schedule?message=Added')
            })
            .catch((err) => {
                next(err);
            })
    })
    router.route('/:id')
        .delete((req, res, next) => {
            db.none("DELETE FROM schedules WHERE id = $1", req.params.id)
                .then(() => {
                    // apply delete functionality here
                    res.send("DELETED");
                })
                .catch((err) => {
                    next(err);
                })
        })
        .put((req, res, next) => {
            // apply Update schedule functionality (only if I have time to do so)
        })
  

module.exports = router;
