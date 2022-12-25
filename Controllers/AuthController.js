import UserModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register user
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newUser = new UserModel(req.body);
  const { username } = req.body;

  try {
    const oldUser = await UserModel.findOne({ username });

    if (oldUser) {
      return res.status(400).json({ messege: "Usename already taken" });
    }

    const user = await newUser.save();

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ messege: error.messege });
  }
};

//Login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (validity) {
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({ user, token });
      } else {
        res.status(400).json("Wrong password");
      }
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(500).json({ messege: error.messege });
  }
};
