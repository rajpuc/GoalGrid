import express, { Router } from "express";
import { checkAuth, logout, signIn, signUp, uploadDataToCloud } from "../app/controllers/authenticationController.js";
import formValidator from "../app/middlewares/formValidatorMiddleware.js";
import { isLoggedIn } from "../app/middlewares/authMiddleware.js";
import { createRoadmapItem, filteredRoadmapItems, getRoadmapItem, getRoadmapItemDetails, getUniqueFilters, toggleUpvote } from "../app/controllers/roadmapItemController.js";
import { createComment, deleteComment, updateComment } from "../app/controllers/commentController.js";
const router = express.Router();

//Authentication routes
router.post("/register",formValidator,signUp);
router.post("/login",signIn);
router.post("/upload-file",uploadDataToCloud);
router.get("/check-auth",isLoggedIn,checkAuth);
router.get("/logout",isLoggedIn,logout);

//Comments routes
router.post("/comment",isLoggedIn,createComment);
router.post("/edit-comment/:commentId",isLoggedIn,updateComment);
router.post("/remove-comment/:commentId",isLoggedIn,deleteComment);

//Roadmap items routes
router.get("/roadmap-items",isLoggedIn,getRoadmapItem);
router.get("/unique-filters",isLoggedIn,getUniqueFilters);
router.get("/filter-items",isLoggedIn,filteredRoadmapItems);
router.post("/upvote/:id",isLoggedIn,toggleUpvote);
router.get("/roadmap-item/:id", isLoggedIn, getRoadmapItemDetails);
router.post("/create", createRoadmapItem);

export default router;