require('dotenv').config();
const generateToken = require('../util/generateToken');
const User = require('../model/auth');
const mailer = require('../util/mailer')
const UnauthenticatedError  = require('../errors/bad-request')
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

const registerUser = async ( req, res, next) => {
    
    try {

        const {name, email, password} = req.body;
    const userExist = await User.findOne({email});

    if(userExist && userExist.active){
        throw new UnauthenticatedError('Email is already registered with us');
    } else if(userExist && !userExist){
        throw new UnauthenticatedError('Account created, just needs verification')
    }

    const port = process.env.PORT || 3000
    // const user = User.create({name, email, password});
    const user =  new User({name, email, password});

    crypto.randomBytes(20, function(err, buf){

        user.activeToken = user._id + buf.toString('hex')

        user.activeExpires = Date.now() + 24 * 3600 * 1000;

        var link = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}/api/v1/users/active/${user.activeToken}`
        : `${port}/api/v1/users/active/${user.activeToken}`

        //sending activation mail 
         mailer.send({
             to: req.body.email,
             subject: 'Welcome to Famous Tech',
             html: 'Please click <a href="' + link + '"> here </a> to activate your account'
         });

         // save user object
         user.save(function (err, user){
             if (err) return next(err);
             res.status(201).json({
                 success: true,
                 msg: 'The activation mail as been sent to '+ user.email +', please click the activation link within 24 hours'
             })
         })


    })

    } catch (error) {
        throw new UnauthenticatedError('Server is unable to process request');
    }
}

const activateToken = async (req, res, next) => {

    User.findOne({
        activeToken: req.params.activeToken,
        activeExpires: {$gt: Date.now()}
    }, function(err, user){

        if(!user){
            throw new UnauthenticatedError('activation link not valid');
        }

        if(user.active == true){
            throw new UnauthenticatedError('Account already verified, try to login')
        }

        user.active = true;
        user.save(function(err, user){
            if(err) return next();

            res.status(201).json({
                success: true,
                msg: `Account Successfully verified`
            })
        })

    })
}

const authUser = async(req, res) => {

    const {email, password} = req.body

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        return res.status(StatusCodes.OK).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    }else{
        return res.status(400).json({
            success: false,
            msg: `user not found`
        })
    }
}

const getProfile = async(req, res) => {

    const user = await User.findById(req.header._id)

    if(user){
        return res.status(StatusCodes.OK).json({
            _id: user._id,
            email : user.email,
            name: user.name,
            avatar: user.avatar
        })
    }else{
        return res.status(401).json({
            success: false,
            msg: 'Unable to retrieve user'
        })
    }
}

const updateUserProfile = async(req, res) => {
    const user = await User.findById(req.header._id)

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;

        const updatedUser = await user.save();

        return res.status(StatusCodes.OK).json({
        
            _id: updatedUser._id,
            email : updatedUser.email,
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            token: generateToken(updatedUser._id),

            success: true,
            
        })

    }else{
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            msg: 'Could not locate user'
        })
    }
}
module.exports = {
    registerUser,
    activateToken,
    authUser, 
    getProfile, 
    updateUserProfile
}