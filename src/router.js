import {Router} from "express";
import auth, {localVariables} from "./middleware/auth.js";
import * as controller from "./controller/app.controller.js";
import * as chatController from "./controller/chat.controller";
import {healthcheck} from "./controller/misc.controller.js";

const router = Router();

router.get("/health", healthcheck);


router.route("/register").post(controller.register);
// router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => {
  res.json("Authenticate");
});
router.route("/login").post(controller.verifyUser, controller.login);


router.route("/user/:email").get(controller.getUser);
router.route("/generateOTP").get(controller.verifyUser, localVariables, controller.generateOTP);
router.route("/verifyOTP").post(controller.verifyUser, controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

router.route("/updateUser").put(auth, controller.updateUser);
router.route("/resetPassword").put(controller.verifyUser, controller.resetPassword);
router.route("/searchUser").get(controller.searchUser);

router.route("/chatRequest").post(auth,chatController.chatRequest);


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
