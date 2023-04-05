import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import config from "config";
import log from "../logger";

//<editor-fold defaultstate="collapsed" desc="This is Custom Fold">
export default async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate request
    //@ts-ignore
    const token: string = req.headers.authorization.split(" ")[1];
    // if(!token){
    //   let err = new Error("you could not be authorized");
    //   next(err);
    //   return;
    // }
    //@ts-ignore
    req.user = await jwt.verify(token, config.get("JWT_SECRETE") as string);
    //@ts-ignore
    console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({error: "Authentication Failure", description: err, trace: new Error().stack});
  }

}

//</editor-fold>

export function localVariables(req: Request, res: Response, next: NextFunction) {
  req.app.locals = {
    otp: null,
    resetSession: false
  };
  next();
}