import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    profileImage: String,
    coverImage: String,
    about: String,
    livesIn: String,
    relationShip: String,
    country: String,
    worksAt: String,
    followers: [],
    followings: [],
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", userSchema);

export default userModel;
