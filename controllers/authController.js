const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// add new user controller
const addNewUserController = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      trcCode,
      referralId,
      gender,
      nationalId,
    } = req.body || {};

    // check user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: {
          email: "This email already exists",
        },
      });
    }

    // check national id
    user = await User.findOne({ nationalId });

    if (user?._id) {
      return res.status(400).json({
        error: {
          nationalId: "This national id already exists",
        },
      });
    }

    // check using phone number
    user = await User.findOne({ phone });

    if (user?._id) {
      return res.status(400).json({
        error: {
          phone: "This phone number is already exists",
        },
      });
    }

    // password hashed
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "server Error" });
        }

        if (hash) {
          // create new user
          const newUser = new User({
            firstName,
            lastName,
            phone,
            trcCode,
            email,
            referralAuthor: referralId,
            password: hash,
            gender,
            nationalId,
            totalBalance: 0,
            depositAmount: 0,
            referralBalance: 0,
            referPayTimes: 0,
          });

          // save user in db
          await newUser.save();

          // send response
          res.status(201).json({
            message: "User saved successfully",
            user: newUser,
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

// login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // check user available
    const user = await User.findOne({ email });

    // check user exists
    if (!user) {
      return res.status(400).json({
        error: {
          email: "User not found! Please try again!!",
        },
      });
    }

    // check password correct or incorrect
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          error: "Server Error Occurred!",
        });
      }

      if (!result) {
        return res.status(400).json({
          error: {
            password: "Email or Password Incorrect!",
          },
        });
      }

      // prepare the user object to generate token
      const userObject = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        totalBalance: user.totalBalance,
        depositAmount: user.depositAmount,
        role: user.role || "user",
        profilePic: user.profilePic,
      };

      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      res.status(200).json({
        user: userObject,
        token,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  addNewUserController,
  loginController,
};
