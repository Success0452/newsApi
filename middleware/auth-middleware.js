const jwt = require('jsonwebtoken');
const User = require('../model/auth');
const {UnauthenticatedError, BadRequestError} = require('../errors/unauthenticated')

const protect = async (req, res, next) => {

    let token; 
    try {
        if(!req.headers.authorization && !req.headers.authorization.startsWith('Bearer')){
            throw new BadRequestError(`validation invalid`);
        }

        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.header = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.log(error);
        throw new UnauthenticatedError(`Unable to validate ${error}`)
    }

    if(!token){
        throw new UnauthenticatedError('Unable to decode token');
    }
}

module.exports = protect;