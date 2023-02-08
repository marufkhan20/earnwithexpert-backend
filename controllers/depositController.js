const Jimp = require("jimp");
const path = require("path");
const Deposit = require("../models/Deposit");
const User = require("../models/User");

// get all deposits controller
const getAllDepositsController = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("user");
    res.status(200).json(deposits);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// create new deposit controller
const createNewDepositController = async (req, res) => {
  try {
    const { amount, screenshot } = req.body || {};
    const { _id } = req.user || {};

    // upload export profile picture
    if (screenshot) {
      // upload image
      const buffer = Buffer.from(
        screenshot.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp
          .resize(300, 300)
          .write(
            path.resolve(__dirname, `../public/storage/deposits/${imagePath}`)
          );

        // create new deposit
        const newDeposit = new Deposit({
          amount,
          screenshot: `/storage/deposits/${imagePath}`,
          user: _id,
        });

        await newDeposit.save();

        // update user deposit array
        const user = await User.findById(_id);
        user.deposits.push(newDeposit);
        await user.save();

        res.status(201).json(newDeposit);
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
      error: "Server error occurred!!",
    });
  }
};

// approve deposit controller
const approveDepositController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const deposit = await Deposit.findById(id);
    deposit.status = "approve";
    deposit.save();

    if (deposit?._id) {
      const depositeUser = await User.findById(deposit?.user);

      // send 10% in referral user
      if (depositeUser?.referralAuthor && depositeUser?.referPayTimes < 2) {
        const referralAuthor = await User.findById(
          depositeUser?.referralAuthor
        );

        if (referralAuthor?._id) {
          referralAuthor.referralBalance =
            referralAuthor.referralBalance + Number(deposit?.amount) * 0.1;

          referralAuthor.totalBalance =
            referralAuthor.totalBalance + Number(deposit?.amount) * 0.1;

          await referralAuthor.save();
        }
        depositeUser.referPayTimes = depositeUser.referPayTimes + 1;
      }

      depositeUser.totalBalance =
        depositeUser?.totalBalance + Number(deposit.amount);
      depositeUser.depositAmount =
        depositeUser?.depositAmount + Number(deposit.amount);
      await depositeUser.save();
    }

    res.status(200).json(deposit);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

module.exports = {
  getAllDepositsController,
  createNewDepositController,
  approveDepositController,
};
