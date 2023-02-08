const { Schema, model } = require("mongoose");

const exportProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    maximumPrice: {
      type: String,
      required: true,
    },
    minimumPrice: {
      type: String,
      required: true,
    },
    description: String,
    hires: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const ExpertProfile = model("ExpertProfile", exportProfileSchema);

module.exports = ExpertProfile;
