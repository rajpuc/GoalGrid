import userModel from "../models/userModel.js";
import { verifyToken } from "../utility/tokenUtility.js";

export const isLoggedIn = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                status:"fail",
                message:"Unauthorized: Please Login First"                
            })
        }

        const decoded = verifyToken(token);

        if(!decoded){
            return res.status(401).json({
                status:"fail",
                message:"Unauthorized: Please Login First"
            })
        }

        const user = await userModel.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                status:"fail",
                message:"Unauthorized: Please Login First"
            })
        }

        req.user=user;
        next();
    }catch(error){
        console.log("Error in authMiddleware : ",error.message);
        res.status(500).json({
            status:"fail",
            message:"Internal Server Error",
            error:error.message
        })
    }
}