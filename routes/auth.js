const express = require('express')
const UserRoute = express.Router();
const protect = require('../middleware/auth-middleware')

const {
    registerUser, 
    activateToken, 
    authUser ,
    getProfile,
    updateUserProfile
} = require('../controller/auth')

UserRoute.route('/auth/register').post(registerUser);
UserRoute.route('/users/active/:activeToken').get(activateToken);
UserRoute.route('/auth/login').post(authUser)
UserRoute.route('/users/profile').get(protect, getProfile).patch( protect, updateUserProfile)


module.exports = UserRoute;