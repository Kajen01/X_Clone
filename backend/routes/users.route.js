import express from "express";

import protectRoute from "../middelware/protectRoute.js";
import { getProfile, followUnFollowUser, getSuggestedUsers, updateUser } from "../controllers/users.controllers.js";

const router = express.Router()

router.get("/profile/:userName", protectRoute, getProfile)
router.post("/follow/:id", protectRoute, followUnFollowUser)
router.get("/suggested", protectRoute, getSuggestedUsers)
router.post("/update", protectRoute, updateUser)

export default router