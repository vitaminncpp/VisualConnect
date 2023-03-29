import {NextFunction, Request, Response} from "express";
import UserModel from '../model/user.model'
import bcrypt from 'bcrypt'
import log from "../logger";
import jwt from "jsonwebtoken";
import config from "../../config/default";
import {omit} from "lodash";

// middleware for verify user
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {username} = req.method == "GET" ? req.query : req.body;
    //check the user's existence
    let exist = await UserModel.findOne({username});
    if (!exist) return res.status(404).send({error: "Cannot Find User", description: ""})
    next();
  } catch (err) {
    return res.status(404).send({error: "Authentication Error", description: err})
  }
}

export async function register(req: Request, res: Response) {
  //@ts-ignore
  console.log(req.body)
  try {
    const {fName, lName, username, password, profile, email, address, mobile} = req.body;
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({username},
          (err: any, user: any) => {
            if (err) reject(new Error(err))
            if (user) reject({error: "Username must be unique"});
            //@ts-ignore
            resolve();
          });
    })
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({email},
          (err: any, email: any) => {
            if (err) reject(new Error(err))
            if (email) reject({error: "Email must be unique"});
            //@ts-ignore
            resolve();
          });
    })
    Promise.all([existUsername, existEmail]).then(() => {
          if (password) {
            bcrypt.hash(password, 10).then((pHash => {
              let userModel = {
                fName,
                lName,
                username,
                password: pHash,
                profile: profile || '',
                mobile,
                email
              }
              if (address) {
                //@ts-ignore
                userModel.address = address;
              }
              const user = new UserModel(userModel);
              // return a save result as a Response
              user.save()
                  .then((result: any) => {
                    res.status(201).send({success: "User Registered Successfully",})
                  }).catch((err: any) => res.status(500).send({error: "Internal Server Error", description: err}))
            })).catch(err => {

            })
          }
        }
    ).catch(err => res.status(500).send({
      error: "Unable to hash password"
    }));
  } catch
      (err) {
    return res.status(500).send(err);
  }
}

export async function login(req: Request, res: Response) {
  const {username, password} = req.body;
  try {
    UserModel.findOne({username})
        .then((user: any) => {
          bcrypt.compare(password, user.password)
              .then(passwordCheck => {
                if (!passwordCheck) {
                  return res.status(400).send({error: "Password does not exist", description: ""})
                }

                //Create JWT token
                const token = jwt.sign({
                  userId: user.__id,
                  username: user.username,
                }, config.JWT_SECRETE, {expiresIn: "24h"})
                return res.status(200).send({
                  msg: "Login Successful",
                  username: user.username,
                  token
                })
              })
              .catch(err => res.status(400).send({error: "Password does not match", description: err}))
        })
        .catch((err: any) => res.status(404).send({error: "username not found", description: err}))
  } catch (err) {
    return res.status(500).send({error: "Internal Server Error", description: err});
  }
}

export async function getUser(req: Request, res: Response) {
  const {username} = req.params;
  try {
    if (!username) return res.status(501).send({error: "Invalid username", description: ""})
    UserModel.findOne({username}, (err: any, user: any) => {
      if (err) {
        res.status(500).send({error: "Invalid username", description: err})
      }
      if (!user) {
        return res.status(501).send({error: "Couldn't find user", description: ""})
      }
      user.password = undefined;
      return res.status(201).send(omit(user, "password"));
    })
  } catch (err) {
    return res.status(404).send({error: "Cannot find user Data", description: err})
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const username = req.query.username;
    if (username) {
      const body = req.body;
      // update the d ata
      UserModel.updateOne({username}, body, (err: any, data: any) => {
        if (err) throw err;
        return res.status(201).send({success: "User Updated Successfully", data})
      });
    } else {
      return res.status(401).send({error: "User not Found", description: ""})
    }
  } catch (err) {
    return res.status(401).send({error: "", description: err})
  }
}

export async function generateOTP(req: Request, res: Response) {
  res.json("Generate OTP Controller")
}

export async function verifyOTP(req: Request, res: Response) {
  res.json("Verify OTP Controller")
}

export async function createResetSession(req: Request, res: Response) {
  res.json("Create Reset Session Controller")
}

export async function resetPassword(req: Request, res: Response) {
  res.json("Reset Password Controller")
}

