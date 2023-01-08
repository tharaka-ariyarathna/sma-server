import jwt from 'jsonwebtoken';

export const generateJwt = (user) => {
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  
    return token;
  };