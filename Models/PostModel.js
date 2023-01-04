import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: String,
    likes: [],
    image: String,
    image_url: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Posts", postSchema);

export default PostModel;

//THis is for a check
