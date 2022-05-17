const express = require('express')
const userRoute = express.Router();
const protect = require('../middleware/auth-middleware')

const {
    registerUser, 
    activateToken, 
    authUser ,
    getProfile,
    updateUserProfile
} = require('../controller/auth')

userRoute.route('/auth/register').post(registerUser);
userRoute.route('/users/active/:activeToken').get(activateToken);
userRoute.route('/auth/login').post(authUser)
userRoute.route('/users/profile').get(protect, getProfile).patch( protect, updateUserProfile)


module.exports = userRoute;