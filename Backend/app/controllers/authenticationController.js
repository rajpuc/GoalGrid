import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import { hashPassword, passComparison } from "../utility/passwordUtility.js";
import { JWT_EXPIRE_TIME } from "../config/config.js";
import { generateToken } from "../utility/tokenUtility.js";
import cloudinary from "../utility/cloudinaryUtility.js";

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);

    //Form data validation
    if (!errors.isEmpty()) {
      const groupedErrors = errors.array().reduce((acc, error) => {
        if (!acc[error.path]) {
          acc[error.path] = [];
        }
        acc[error.path].push(error.msg);
        return acc;
      }, {});
      return res.status(400).json({
        status: "fail",
        message: "Serverside validation error",
        error: groupedErrors,
      });
    }

    const { fullName, email, password, confirmPassword, profileImageUrl } =
      req.body;

    //Check the user is already exist or not
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered",
      });
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //Register user in DB
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    //Send response
    return res.status(201).json({
      status: "success",
      message: "Successfully Registered",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.log("Error in signUp Controller: " + error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // Check is password valid
    const isPasswordValid = await passComparison(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    //Generate jwt token
    const token = generateToken(user._id, user.email);

    //Send token through Cookies
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.Node_Env === "production",
      sameSite: "strict",
      maxAge: JWT_EXPIRE_TIME * 1000,
    };
    res.cookie("token", token, tokenOptions);

    res.status(200).json({
      status: "success",
      message: "Successfully Login",
      data:{
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
      },
    });
  } catch (error) {
    console.log("Error in signIn Controller: " + error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const uploadDataToCloud = async (req, res) => {
  try {
    const { file } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(file);
    return res.status(200).json({
      status:"success",
      message:"File uploaded successfully.",
      data: uploadResponse.secure_url 
    });
  } catch (error) {
    console.log('Error in uploadDataToCloud Controller: '+error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res)=>{
  try{
    res.status(200).json({
      status:"success",
      message:"Successfully retrieved user",
      data:req.user,
    });
  }catch(error){
    console.log('Error in checkAuth Controller: '+error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const logout = (req,res)=>{
  try{
    res.cookie("token","",{maxAge:0});
    res.status(200).json({
      status:"success",
      message:"Successfully logout."
    })
  }catch(error){
    console.log('Error in logout Controller: '+error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}