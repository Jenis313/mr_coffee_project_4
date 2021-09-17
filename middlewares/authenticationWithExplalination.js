const JWT = require('jsonwebtoken');
const configs = require('./../configs/index');
const db  =  require('./../models/db');
const redirectToLogin = function(req,res,next){
    // Check if there is token in the request
    // if there is no token, redirect to login page
    // if token, check if the token is verified or not with the help of JWT.verify
    // after verification, test if the details of verified token is still up-to-date with database because jwt token works even after the deletion of the user of that token.
    // if token is up-to-date, put the fresh users detail from databasee in request object. 
    
    let token;
    // if(req.headers['authorization'])
    //     token = req.headers['authorization']
    // if(req.headers['x-access-token'])
    //     token = req.headers['x-access-token'];
    // if(req.query['token'])
    //     token = req.query['token']
    token = req.cookies.jwt
    console.log('token-->',token);
    if(!token){
        console.log('No token')
        res.redirect('/auth/login')
        // return next({
        //     msg: 'authentication failed',
        //     status : 404
        // });
    }else{
        //Token available now
        JWT.verify(token, configs.JWT_SECRET, (err, result) => {
            if(err){
                return next(err);
            }
            console.log('result--> ', result)
            console.log('Token verifaication successful'); 
            // Now check if the token details are up-to-date with the database
            db.one("SELECT * FROM users WHERE id = $1", result.id)
            .then((user) => {
                // Case token verified but not up-to-date with db
                if(!user){
                    return next({
                        msg: 'User removed from the system',
                        status: 404  
                    })
                }
                // Case token verified and up-to-date with database
                console.log('current user--> ',user);
                // Set user's detail to request object
                req.currentUser = user;
                next()
            })
            .catch((err) => {
                // Query error
                next(err);
            })
        })
    }
}
const redirectToHome = function(req, res, next){
    let token;
    token = req.cookies.jwt
    console.log('token-->',token);
    if(token){
        JWT.verify(token, configs.JWT_SECRET, (err, result) => {
            if(err){
                return next(err);
            }
            console.log('result--> ', result)
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
                console.log('current user--> ',user);
                req.currentUser = user;
                res.redirect('/')

            })
            .catch((err) => {
                next(err);
            })
        })
    }else{
        next()
    }
}

module.exports = {
    redirectToHome,
    redirectToLogin
};