import {NextFunction, Request, response, Response} from "express";
import UserModel from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import config from "config";

const saltWorkFactor = config.get("saltWorkFactor") as number;

// middleware for verify user
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {username} = req.method == "GET" ? req.query : req.body;
    //check the user's existence
    const exist = await UserModel.findOne({username});
    if (!exist) return res.status(404).send({
      error: "Cannot Find User", description: "", //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
    next();
  } catch (err) {
    return res.status(404).send({
      error: "Authentication Error", description: err,
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function register(req: Request, res: Response) {
  //@ts-ignore
  console.log(req.body);
  try {
    const {fName, lName, username, password, profile, email, address, mobile} = req.body;
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({username},
        (err: any, user: any) => {
          if (err) reject(new Error(err));
          if (user) reject({
            error: "Username must be unique", description: "", //@ts-ignore
            trace: new Error().stack.split("\n").map(d => d.trim()),
          });
          //@ts-ignore
          resolve();
        });
    });
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({email},
        (err: any, email: any) => {
          if (err) reject(new Error(err));
          if (email) reject({
            error: "Email must be unique", description: "",
            //@ts-ignore
            trace: new Error().stack.split("\n").map(d => d.trim()),
          });
          //@ts-ignore
          resolve();
        });
    });
    Promise.all([existUsername, existEmail]).then(() => {
        if (password) {
          bcrypt.hash(password, 10).then((pHash => {
            const userModel = {
              fName,
              lName,
              username,
              password: pHash,
              profile,
              mobile,
              email
            };
            if (address) {
              //@ts-ignore
              userModel.address = address;
            }
            const user = new UserModel(userModel);
            // return a save result as a Response
            user.save()
              .then((result: any) => {
                res.status(201).send({success: "User Registered Successfully",});
              }).catch((err: any) => res.status(500).send({
              error: "Internal Server Error",
              description: err,
              //@ts-ignore
              trace: new Error().stack.split("\n").map(d => d.trim()),
            }));
          })).catch(err => {
            res.status(500).send({
              error: "Could not Sign up",
              description: err,
              //@ts-ignore
              trace: new Error().stack.split("\n").map(d => d.trim()),
            });
          });
        }
      }
    ).catch(err => res.status(500).send({
      error: "Could not Sign up",
      description: err,
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    }));
  } catch
    (err) {
    return res.status(500).send({
      error: "Could not Sign up", description: err,
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
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
              return res.status(400).send({
                error: "Password does not match",
                description: "",
                //@ts-ignore
                trace: new Error().stack.split("\n").map(d => d.trim()),
              });
            }
            //Create JWT token
            const token = jwt.sign({
              username: user.username,
            }, config.get("JWT_SECRETE") as string, {expiresIn: "24h"});
            return res.status(200).send({
              success: "Login Successful",
              username: user.username,
              token
            });
          })
          .catch(err => res.status(400).send({
            error: "Password does not match",
            description: err,
            //@ts-ignore
            trace: new Error().stack.split("\n").map(d => d.trim()),
          }));
      })
      .catch((err: any) => res.status(404).send({
        error: "username not found",
        description: err,
        //@ts-ignore
        trace: new Error().stack.split("\n").map(d => d.trim()),
      }));
  } catch (err) {
    return res.status(500).send({
      error: "Internal Server Error", description: err, //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function getUser(req: Request, res: Response) {
  const {username} = req.params;
  try {
    if (!username) return res.status(501).send({
      error: "Invalid username",
      description: "",
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
    UserModel.findOne({username}, (err: any, user: any) => {
      if (err) {
        res.status(500).send({
          error: "Invalid username", description: err,
          //@ts-ignore
          trace: new Error().stack.split("\n").map(d => d.trim()),
        });
      }
      if (!user) {
        return res.status(501).send({
          error: "Couldn't find user", description: "",
          //@ts-ignore
          trace: new Error().stack.split("\n").map(d => d.trim()),
        });
      }
      const {__id, fName, lName, username, profile, mobile, email,} = user;
      return res.status(201).send({__id, fName, lName, username, profile, mobile, email,});
    });
  } catch (err) {
    return res.status(404).send({
      error: "Cannot find user Data", description: err, //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    //@ts-ignore
    const {username} = req.user;

    if (username) {
      const body = req.body;
      // update the d ata
      UserModel.updateOne({username}, body, (err: any, data: any) => {
        if (err) {
          return res.status(501).send({
            error: "Could not update user data",
            description: err,
            //@ts-ignore
            trace: new Error().stack.split("\n").map(d => d.trim()),
            data
          });
        }
        return res.status(201).send({success: "User Updated Successfully", data});
      });
    } else {
      return res.status(401).send({
        error: "User not Found", description: "", //@ts-ignore
        trace: new Error().stack.split("\n").map(d => d.trim()),
      });
    }
  } catch (err) {
    return res.status(401).send({
      error: "An Error occurred ! See stack trace to learn more",
      description: err,
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function generateOTP(req: Request, res: Response) {
  req.app.locals.otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  res.status(201).send({success: "OTP Created Successfully   ", code: req.app.locals.otp});

}

export async function verifyOTP(req: Request, res: Response) {
  const {code} = req.body;
  if (parseInt(req.app.locals.otp) === parseInt(code)) {
    req.app.locals.otp = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({success: "OTP verified Successfully !"});
  }
  return res.status(400).send({
    error: "invalid OTP !",
    description: "",
    //@ts-ignore
    trace: new Error().stack.split("\n").map(e => e.trim())
  });
}

export async function createResetSession(req: Request, res: Response) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({success: "Access Granted"});
  }
  return res.status(440).send({
    error: "Session Expired", description: "",
    //@ts-ignore
    trace: new Error().stack.split("\n").map(e => e.trim())
  });
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const {username, password} = req.body;
    try {
      UserModel.findOne({username})
        .then((user: any) => {
            bcrypt.hash(password, saltWorkFactor)
              .then(pHash => {
                UserModel.updateOne({username: user.username}, {password: pHash}, (err: any, data: any) => {
                  if(err) throw err;
                  return res.status(201).send({success:"Password Updated Successfully"})
                })
              })
              .catch((err) => {
                return res.status(500).send({
                  error: "Unable hash password", description: err,
                  //@ts-ignore
                  trace: new Error().stack.split("\n").map(e => e.trim())
                })
              });
          }
        )
        .catch((err: any) => {
          return res.status(404).send({
            error: "User not found", description: err,
            //@ts-ignore
            trace: new Error().stack.split("\n").map(e => e.trim())
          });
        })
    } catch (err) {
      return res.status(500).send({
        error: "Error Updating password", description: err,
        //@ts-ignore
        trace: new Error().stack.split("\n").map(e => e.trim())
      });
    }
  } catch (err) {
    return res.status(401).send({
      error: "Error Updating password", description: err,
      //@ts-ignore
      trace: new Error().stack.split("\n").map(e => e.trim())
    });
  }

}

