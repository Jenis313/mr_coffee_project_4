const express = require('express');
const router = express.Router();
const {redirectToHome, redirectToLogin} = require('./../middlewares/authentication');
// Import Routers
const indexRouter = require('./../controllers/index.controller');
const authRouter = require('./../controllers/auth.controller');
const userRouter = require('./../controllers/user.controller');
const scheduleRouter = require('./../controllers/schedule.controller');
const logoutRouter = require('./../controllers/logout.controller');

router.use('/logout', logoutRouter);
router.use('/auth', redirectToHome, authRouter);
router.use('/user', redirectToLogin, userRouter);
router.use('/schedule',redirectToLogin, scheduleRouter);
router.use('/', redirectToLogin, indexRouter);

module.exports = router;

