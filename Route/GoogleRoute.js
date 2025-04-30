import express from "express";
import passport from "passport";
import { handleAuthSuccess } from "../Controller/UserController.js";


const router = express.Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), handleAuthSuccess);

export default router;