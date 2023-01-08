import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  gettimelinePosts,
  likePost,
  updatePost,
  getAllUserPosts,
} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id/timeline", gettimelinePosts);
router.get("/:id/profile", getAllUserPosts) ;

export default router;
