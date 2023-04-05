import express from "express";
import jwt from "jsonwebtoken";
import log from "../logger/index.js";
import dotenv from "dotenv";

dotenv.config();


export default async function auth(req, res, next) {
  try {
    // Validate request
    //@ts-ignore
    const token = req.headers.authorization.split(" ")[1];
    // if(!token){
    //   let err = new Error("you could not be authorized");
    //   next(err);
    //   return;
    // }
    //@ts-ignore
    req.user = await jwt.verify(token, process.env.JWT_SECRETE);
    //@ts-ignore
    console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({error: "Authentication Failure", description: err, trace: new Error().stack});
  }

}

export function localVariables(req, res, next) {
  req.app.locals = {
    otp: null,
    resetSession: false
  };
  next();
}