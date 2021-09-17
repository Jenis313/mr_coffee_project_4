const JWT = require('jsonwebtoken');
const configs = require('./../configs/index');
const db  =  require('./../models/db');

const redirectToLogin = function(req,res,next){
    let token;
    token = req.cookies.jwt
    if(!token){
        console.log('No token')
        res.redirect('/auth/login')
    }else{
        //Token available
        jwtVerify(token, '', req, res, next)
    }
}

const redirectToHome = function(req, res, next){
    let token;
    token = req.cookies.jwt
    if(token){
        jwtVerify(token, 'home', req, res, next);
    }else{
        next()
    }
}

function jwtVerify(token, path, req, res, next){
    JWT.verify(token, configs.JWT_SECRET, (err, result) => {
        if(err){
            return next(err);
        }
        // console.log('result--> ', result)
        console.log('Token verifaication successful'); 
        // Now check if the token details are up-to-date with the database
        db.one("SELECT * FROM users WHERE id = $1", result.id)
        .then((user) => {
            if(!user){
                return next({
                    msg: 'User removed from the system',
                    status: 404  
                })
            }
            // console.log('current user--> ',user);
            req.currentUser = user;
            if(path==='home'){
                // Case token
                res.redirect('/');
            }else{
                // Case no token
                next();
            }

        })
        .catch((err) => {
            next(err);
        })
    })
}

module.exports = {
    redirectToHome,
    redirectToLogin
};