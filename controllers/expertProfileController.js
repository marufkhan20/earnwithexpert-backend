const ExpertProfile = require("../models/ExpertProfile");
const Jimp = require("jimp");
const path = require("path");
const HireExpert = require("../models/HireExpert");
const User = require("../models/User");

// get all expert profiles controller
const getAllExpertProfilesController = async (req, res) => {
  try {
    const expertProfiles = await ExpertProfile.find();
    res.status(200).json(expertProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// create new expert profile controller
const createNewExpertProfileController = async (req, res) => {
  try {
    const { name, profilePic, maximumPrice, minimumPrice, description } =
      req.body || {};

    // upload export profile picture
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
            path.resolve(
              __dirname,
              `../public/storage/expert-profiles/${imagePath}`
            )
          );

        // create new expert profile
        const newExpertProfile = new ExpertProfile({
          name,
          maximumPrice,
          minimumPrice,
          profilePic: `/storage/expert-profiles/${imagePath}`,
          description,
        });

        await newExpertProfile.save();

        res.status(201).json(newExpertProfile);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// delete expert profile controller
const deleteExpertProfileController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const deletedExpertProfile = await ExpertProfile.findByIdAndDelete(id);
    res.status(200).json(deletedExpertProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// hire new expert controller
const hireNewExpertController = async (req, res) => {
  try {
    const { amount, expert } = req.body || {};
    const { _id } = req.user || {};

    const user = await User.findById(_id);

    const newHireExpert = new HireExpert({
      price: amount,
      user: _id,
      expertProfile: expert,
    });

    // update user hire experts array
    user.hireExperts.push(newHireExpert?._id);
    user.hireBalance = user.hireBalance || 0 + Number(amount);
    await user.save();

    await newHireExpert.save();

    // update expert profile
    const expertProfile = await ExpertProfile.findById(expert);
    expertProfile.hires.push(newHireExpert?._id);
    await expertProfile.save();

    res.status(201).json(newHireExpert);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// get all hire experts controller
const getAllHireExpertsController = async (req, res) => {
  try {
    const hireExperts = await HireExpert.find().populate([
      "user",
      "expertProfile",
    ]);
    res.status(200).json(hireExperts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// get all hire experts by user controller
const getAllHireExpertsByUserController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const hireExperts = await HireExpert.find({ user: id }).populate([
      "expertProfile",
    ]);
    res.status(200).json(hireExperts);
  } catch (err) {
    console.error(err);
    re.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// update hire expert status controller
const updateHireExpertStatusController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const { status } = req.body || {};

    // update hire expert status
    const updatedHireExpert = await HireExpert.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate(["user", "expertProfile"]);

    // update user hire balance and total balance
    const user = await User.findById(updatedHireExpert.user?._id);
    user.hireBalance = user?.hireBalance - updatedHireExpert?.price;
    if (status === "approved") {
      user.totalBalance = user?.totalBalance - updatedHireExpert?.price;
    }

    await user.save();

    res.status(200).json(updatedHireExpert);
  } catch (err) {
    console.error(err);
    re.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  getAllExpertProfilesController,
  createNewExpertProfileController,
  deleteExpertProfileController,
  hireNewExpertController,
  getAllHireExpertsController,
  getAllHireExpertsByUserController,
  updateHireExpertStatusController,
};
