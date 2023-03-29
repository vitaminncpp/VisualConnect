import {Router} from "express";
import mongoose from "mongoose";
import log from "./logger";
import * as controller from "./controller/app.controller";

const router = Router();

// Healthcheck
router.get("/health", (req, res) => {
  res.json("Everything works Fine");
});


// POST methods
router.route("/register").post(controller.register);
// router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => {
  res.json("Authenticate")
});
router.route("/login").post(controller.verifyUser, controller.login);

// POST methods
router.route("/user/:username").get(controller.getUser);
router.route("/generateOTP").get(controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

// PUT methods
router.route("/updateUser").put(controller.updateUser)


// Register the user
// POST /api/user

// Login
// POST /api/session

// Get users session
// GET /api/sessions

// Logout
// DELETE /api/sessions

// GET /api/posts


export default router;
