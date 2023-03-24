import {Express, Request, Response} from "express";
import {Router} from "express";
import mongoose from "mongoose";
import log from "./logger";

const router = Router();
router.get("/", (req, res) => {
  console.log(mongoose.connection.name);
  res.json(mongoose.connection.name);
});

router.post("/register", (req, res) => {
  res.json("Register")
})
router.post("/registerMail", (req, res) => {
  res.json("Register Mail")
})
router.post("/authenticate", (req, res) => {
  res.json("Hello There")
})
router.post("/login", (req, res) => {
  res.json("Hello There")
})

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
