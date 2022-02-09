const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
//Check for JSON web token in the headers.
exports.protect = async (req, res, next) => {
  let token;
  //We will be adding 'Bearer' to our token to show that it is an authentication bearing token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //Set token to the portin of the authorization after the space (the token portion)
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    //Decode the token we just got. 'verify' decrypts the token based off our our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Id comes from the payload when the token was initially set (See User.js getSignedToken method)
    const user = await User.findById(decoded.id);
    //If user isn't found, token isn't valid
    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }
    //One the request object, set the user found by Id
    req.user = user;

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this router', 401));
  }
};
