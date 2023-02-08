const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    profilePic: String,
    email: String,
    password: String,
    gender: String,
    phone: String,
    trcCode: String,
    nationalId: String,
    totalBalance: Number,
    depositAmount: Number,
    referralUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    referralAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    referralBalance: Number,
    referPayTimes: Number,
    role: {
      type: String,
      default: "user",
    },
    deposits: {
      type: [Schema.Types.ObjectId],
      ref: "Deposit",
    },
    widthraws: {
      type: [Schema.Types.ObjectId],
      ref: "Widthraw",
    },
    hireExperts: {
      type: [Schema.Types.ObjectId],
      ref: "HireExpert",
    },
    hireBalance: {
      type: Number,
      default: 0,
    },
    tradingBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
