var express = require('express');
var router = express.Router();
const db = require('../models/db')

// render user's profile based on their id
router.get('/:id', function(req, res, next) {
  console.log('req params ---> ', req.params.id)

  db.any("SELECT * FROM users INNER JOIN schedules ON schedules.user_id = users.id WHERE user_id = $1", req.params.id)
    .then((data) => {
      console.log(data);
      // res.json(data);
      res.render('pages/profile.ejs',{
        schedules: data,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        email: data[0].email
      });
    })
    .catch((err) => {
      next({
        msg:'Invalid User or this user doesnt have any schedules',
        status: 404
      });
    })
});

module.exports = router;
