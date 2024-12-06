import express from "express";

import protectRoute from "../middelware/protectRoute.js";
import { getProfile } from "../controllers/users.controllers.js";

const router = express.Router()

router.get("/profile/:userName", protectRoute, getProfile)


export default router