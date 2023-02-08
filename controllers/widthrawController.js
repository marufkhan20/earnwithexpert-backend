const User = require("../models/User");
const Widthraw = require("../models/Widthraw");

// get all widthraws controller
const getAllWidthrawsController = async (req, res) => {
  try {
    const widthraws = await Widthraw.find().populate(["user"]);
    res.status(200).json(widthraws);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// approve widthraw controller
const approveWidthrawController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const widthraw = await Widthraw.findById(id);
    widthraw.status = "approve";
    widthraw.save();

    res.status(200).json(widthraw);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// create new widthraw controller
const createNewWidthrawController = async (req, res) => {
  try {
    const { amount } = req.body || {};
    const { _id } = req.user || {};

    const user = await User.findById(_id);

    const newWidthraw = new Widthraw({
      amount,
      user: _id,
      trcCode: user?.trcCode,
    });

    await newWidthraw.save();

    // update user
    user.totalBalance = user.totalBalance - Number(amount);
    user.widthraws.push(newWidthraw?._id);
    await user.save();

    res.status(201).json(newWidthraw);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

module.exports = {
  getAllWidthrawsController,
  approveWidthrawController,
  createNewWidthrawController,
};
