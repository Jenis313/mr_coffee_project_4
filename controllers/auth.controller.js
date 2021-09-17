const express = require('express');
const router = express.Router();
const db = require('./../models/db');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const  configs = require('./../configs/index');

// Sign Token
function generateToken(data){
    return jwt.sign({
        id: data.id,
        first_name: data.first_name,
        email: data.email
    }, configs.JWT_SECRET/*, {
        expiresIn: '1d'
    }*/)
}

// Login handler
router.route('/login')
    .get((req, res, next) => {
        // check if logged in
        // if logged in redirect to home page
        // if not logged in render Login page
        res.render('./pages/login.ejs')
        
    })
    .post((req, res, next) => {
        // check if user exists
        // verify email and password

        db.oneOrNone('SELECT * FROM users WHERE email = $1', req.body.email)
        .then((user) => {
            console.log('user --> ', user)
            if(!user){
                return next({
                    msg: 'Invalid Credientials',
                    status: 400
                })
            }
            //User found now verify password
            const hash = user.password
            bcrypt.compare(req.body.password, hash)
            .then((result) => {
                // if verified generate token, set token into header and redirect to home page
                if(result){
                    let token = generateToken(user);//It generates a token for the user
                    res.cookie('jwt', token)
                    res.redirect('../')
                }else{
                    next({
                        msg:'Invalid Credientials',
                        status: 400
                    })
                }

            })
            .catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            next(err);
        });
    })

//register handler
router.route('/register')
    .get((req, res, next) => {
        // render register page
        res.render('./pages/register.ejs')
    })
    .post((req, res, next) => {
        // get data from form 
        // map data(optional)
        // save data into database
        const {first_name, last_name, email, password} = req.body;
       
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err){
                return next(err);
            }
            db.none("INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", [first_name, last_name, email, hash])
            .then(() => {
                // res.redirect('/home') 
                res.send('Success');
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
        });
    })

// Logout Router
router.get('/logout', (req, res, next) => {
    console.log('Hit this url')
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/auth/login');
})
module.exports = router;