const User = require("../models/User");
const Jimp = require("jimp");
const path = require("path");

// get all users controller
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get user controller
const getUserByUserIdController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const user = await User.findById(id).populate([
      "deposits",
      "widthraws",
      "hireExperts",
    ]);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// update profile pic controller
const updateProfilePicController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const { profilePic } = req.body || {};

    if (!id) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    if (!profilePic) {
      return res.status(400).json({ error: "Profile Pic is Required!" });
    }

    if (profilePic) {
      // upload image
      const buffer = Buffer.from(
        profilePic.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp
          .resize(300, 300)
          .write(
            path.resolve(__dirname, `../public/storage/profile/${imagePath}`)
          );

        // update database
        if (imagePath) {
          const updatedProfile = await User.findByIdAndUpdate(
            id,
            { $set: { profilePic: `/storage/profile/${imagePath}` } },
            { new: true }
          );

          res.status(200).json(updatedProfile);
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server Error Occurred",
    });
  }
};

// play game controller
const playGameController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const { status, amount } = req.body || {};

    const user = await User.findById(id);
    if (status === "win") {
      user.totalBalance = user.totalBalance + Number(amount);
      user.tradingBalance = user.tradingBalance + Number(amount);
    } else if (status === "lost") {
      user.totalBalance = user.totalBalance - Number(amount);
    }

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error occured",
    });
  }
};

// delete user controller
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred",
    });
  }
};

module.exports = {
  getUserByUserIdController,
  updateProfilePicController,
  getAllUsersController,
  deleteUserController,
  playGameController,
};
