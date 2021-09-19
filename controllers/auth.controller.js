const express = require('express');
const router = express.Router();
const db = require('./../models/db');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const  configs = require('./../configs/index');
const {body, validationResult} = require('express-validator');

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
                res.render('./pages/login.ejs', {
                    error : 'Invalid Credientials!'
                })
                return 
            }
            //User found now verify password
            const hash = user.password
            bcrypt.compare(req.body.password, hash)
            .then((result) => {
                // if verified, generate token, set token into header and redirect to home page
                if(result){
                    let token = generateToken(user);//It generates a token for the user
                    res.cookie('jwt', token)
                    res.redirect('../')
                }else{
                    res.render('./pages/login.ejs', {
                        error : 'Invalid Credientials!'
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
    .post(
        // Express validator
        body('first_name', "First name cannot be empty")
        .notEmpty(),

        body('last_name', "Last name cannot be empty")
        .notEmpty(),
    
        body('email', "Empty or invalid email")
        .isEmail(),
        body('email').custom(value => {
            return db.oneOrNone('SELECT * FROM users WHERE email = $1', value)
            .then((user) => {
                if(user){
                    return Promise.reject('Email already in use');
                }
            })
          }), 

        body('password', "Password cannot be empty")
        .notEmpty(),
        body('password', "Password must be longer than 6 characters and contain a letter, a number and a special character")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "i"),

        body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error("Password confirmation does not match");
            }
        
            // Indicates the success of this synchronous custom validator
            return true;
          }),

        (req, res, next) => {  
        const result = validationResult(req); //It stores all the errors
        // get data from form 
        // Make sure there is no error
        // map data(optional)
        // save data into database
        if(!result.isEmpty()){
            res.render('./pages/register.ejs', {
                errors: result.errors
            })
        }else{
            const {first_name, last_name, email, password} = req.body;
       
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err){
                    return next(err);
                }
                db.oneOrNone("INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING * " , [first_name, last_name, email, hash])
                .then((user) => {
                    let token = generateToken(user);//It generates a token for the user
                    res.cookie('jwt', token)
                    res.redirect('../') 
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                })
            });
        }

        
    })

// Logout Router
// router.get('/logout', (req, res, next) => {
//     console.log('Hit this url')
//     res.cookie('jwt', '', {
//         maxAge: 1
//     })
//     res.redirect('/auth/login');
// })
module.exports = router;