import e, { response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken"

//get all users

export const getAllUsers = async(req, res) => {
  try {
    let data = await UserModel.find() ;
    const users = data.map(user => {
      const {password, ...otherDetails} = user._doc ;
      return otherDetails ;
    })
    res.status(200).json({data : users}) ;
  } catch (error) {
    res.status(400).json({error : error})
  }
}

//get a user

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, curruntUserAdminStatus, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({user, token});
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(404).json("Access denied!");
  }
};

//delete user

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  try {
    if (currentUserId === id || currentUserAdminStatus) {
      const user = await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } else {
      res.status(404).json("Access denied!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//follow user

export const followUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;

  try {
    if (id === _id) {
      res.status(403).json("Action forbidden!");
    } else {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        console.log("Here2")
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { followings: id } });
        let user = await UserModel.findById(_id);

        const token = generateJwt(user) ;

        res.status(200).json({user, token});
      } else {
        res.status(403).json("User alreaddy following");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//unfollow user

export const unFollowUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  try {
    if (id === currentUserId) {
      res.status(403).json("Action forbidden!");
    } else {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { followings: id } });
        res.status(200).json("User unfollowed");
      } else {
        res.status(403).json("You are not following user");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const generateJwt = (user) => {
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  )

  return token ;
}
