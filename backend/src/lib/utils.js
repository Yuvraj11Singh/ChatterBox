import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        httpOnly: true, // prevents XSS attacks (cross-site scripting)
        maxAge: 1000 * 60 * 60 * 24 * 7, // MS , 7 days 
        sameSite: "strict",  // csrf attacks cross-site request forgery 
        secure: process.env.NODE_ENV !== "development"
  
    });
  return token; 
};