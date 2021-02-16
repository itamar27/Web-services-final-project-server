const { Router } = require('express');
const {authController} = require('../controllers/auth.ctrl');
const authRouter = new Router()

authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);
authRouter.post('/signup', authController.signup);
authRouter.get('/getCredentials', authController.getCredentials);


module.exports = { authRouter };