import jwt from "jsonwebtoken";
import {JWT_EXPIRE_TIME} from "../config/config.js"

export const generateToken = (userId, email) => {
    try{
        const payload = {email, userId};
        const options = {expiresIn:JWT_EXPIRE_TIME};
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
    }catch(error){
        console.log("Token generation error : ", error.message);
        throw new Error("Failed to generate authentication token.");
    }
}

export const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET_KEY)
    }catch(error){
        console.log("Token verification Error : ",error.message);
        throw new Error("Failed to verify the token.")
    }
}