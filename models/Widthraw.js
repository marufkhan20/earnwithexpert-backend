const { Schema, model } = require("mongoose");

const widthrawSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trcCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approve"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Widthraw = model("Widthraw", widthrawSchema);

module.exports = Widthraw;
