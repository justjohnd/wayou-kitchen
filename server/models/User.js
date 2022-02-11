const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//Use jwt to get signed token
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provied an email"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

//Mongoose allows you to create your own middleware to run before (pre) or after (post) saving. Note that function passed must be declarative (not arrow function)
UserSchema.pre("save", async function(next) {
  //Note that 'this' below refers to the User object created using User.create() in the auth.js controller
  //If the password is not modifified, save without rehashing. Run next() to move to next line
  if(!this.isModified("password")) {
    next();
  }
  //Use bcrypt package to generate a salt
  const salt = await bcrypt.genSalt(10);
  //Hash the password and pass the salt to it, then save to the user
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Use this method to match passwords. 'this' refers to the user pulled from the database.
UserSchema.methods.matchPasswords = async function(password) {
  return await bcrypt.compare(password, this.password);
};
//This function will use JWT and return a signed token
UserSchema.methods.getSignedToken = function () {
  //Pass 'sign' a payload of the id. 'this' refers to the object we are calling the method on (user). Next pass a secret, and finally an object including options. The payload will add the id of the user to the token
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
