const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//when working with the database always use async functions
exports.register = async (req, res, next) => {
  //Extract properties from the request body
  const { userName, email, password } = req.body;

  // Use try...catch to catch any errors when using async code
  try {
    // Create a new user from the user model (note, you need to hash password by using a piece of middleware before you save the user)
    const user = await User.create({ userName, email, password });
    //Send token, response status and JSON object
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //Good practice to check both front and back end for email
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  try {
    //Email address is unique, so findOne() can be used. This will return the user and password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Email incorrect, please try again", 401));
    }
    // Compare password with password in database. Use a special method stored in models. Note that you can create methods can be used on specific objects, such as 'user', and define them in the User model. Password being passed below comes from req.body
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(
        new ErrorResponse("Password incorrect, please try again", 401)
      );
    }
    //Respond with a token
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Requested",
        text: message,
      });

      res.status(200).json({
        success: true,
        data: "Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPassowrdExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

//Reusable function, pass user, statusCode, and response
const sendToken = (user, statusCode, res) => {
  //Use a method defined in User model
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
