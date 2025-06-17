import express from "express";
import { checkAuth, logout, signIn, signUp, uploadDataToCloud } from "../app/controllers/authenticationController.js";
import formValidator from "../app/middlewares/formValidatorMiddleware.js";
import { isLoggedIn } from "../app/middlewares/authMiddleware.js";
const router = express.Router();

//Authentication routes
router.post("/register",formValidator,signUp);
router.post("/login",signIn);
router.post("/upload-file",isLoggedIn,uploadDataToCloud);
router.get("/check-auth",isLoggedIn,checkAuth);
router.get("/logout",isLoggedIn,logout);
//Comments routes

//Roadmap items routes

export default router;