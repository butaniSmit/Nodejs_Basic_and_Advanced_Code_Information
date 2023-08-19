const express = require('express');
const userController = require('./../controllers/userController');
const AuthController = require('./../controllers/authController');
const Router = express.Router();

Router.post('/signup',AuthController.signup);
Router.post('/login',AuthController.login);
Router.post('/forgotpassword',AuthController.forgotPassword);
Router.post('/resetpassword/:token',AuthController.resetPassword);

Router.use(AuthController.protect);

Router.patch('/updateMyPassword', AuthController.updatePassword);
Router.get('/me', userController.getMe, userController.getOne);
Router.patch('/updateMe',
userController.uploadUserPhoto,
// userController.resizeUserPhoto,
 userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);

Router.route('/').get(AuthController.protect,
    //  userController.grantAccess('user-listing','add-user'), 
     userController.getAllUser)
Router.route('/:id').get(userController.getOne).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = Router;