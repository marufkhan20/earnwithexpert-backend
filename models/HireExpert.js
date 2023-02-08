const { Schema, model } = require("mongoose");

const hireExpertSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    expertProfile: {
      type: Schema.Types.ObjectId,
      ref: "ExpertProfile",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const HireExpert = model("HireExpert", hireExpertSchema);

module.exports = HireExpert;
