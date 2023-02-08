const { Schema, model } = require("mongoose");

const depositSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approve"],
  },
  depositTime: Number,
});

const Deposit = model("Deposit", depositSchema);

module.exports = Deposit;
