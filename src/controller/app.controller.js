import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const saltWorkFactor = process.env.SALT_WORK_FACTOR;

// middleware for verify user
export async function verifyUser(req, res, next) {
  try {
    const {email} = req.method === "GET" ? req.query : req.body;
    //check the user's existence
    const exist = await UserModel.findOne({email});
    if (!exist) return res.status(404).send({
      error: "Cannot Find Email", description: "", //@ts-ignore
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

export async function register(req, res) {
  //@ts-ignore
  console.log(req.body);
  try {
    const {name, email, password, mobile} = req.body;

    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({email},
        (err, email) => {
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
    existEmail.then(() => {
        if (password) {
          bcrypt.hash(password, 10).then((pHash => {
            const userModel = {
              name,
              email,
              password: pHash,
              mobile,
            };
            const user = new UserModel(userModel);
            // return a save result as a Response
            user.save()
              .then((result) => {
                res.status(201).send({success: "User Registered Successfully",});
              }).catch((err) => res.status(500).send({
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

export async function login(req, res) {
  const {email, password} = req.body;
  try {
    UserModel.findOne({email})
      .then((user) => {
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
              email: user.email,
            }, process.env.JWT_SECRETE, {expiresIn: "24h"});
            //@ts-ignore
            console.log(user);
            return res.status(200).send({
              success: "Login Successful",
              user,
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
      .catch((err) => res.status(404).send({
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

export async function getUser(req, res) {
  const {email} = req.params;
  try {
    if (!email) return res.status(501).send({
      error: "Invalid Email ID",
      description: "",
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
    UserModel.findOne({email}, (err, user) => {
      if (err) {
        res.status(500).send({
          error: "Invalid Email ID", description: err,
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
      const {__id, name, email, mobile,} = user;
      return res.status(201).send({__id, name, email, mobile,});
    });
  } catch (err) {
    return res.status(404).send({
      error: "Cannot find user Data", description: err, //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function updateUser(req, res) {
  try {
    //@ts-ignore
    const {email} = req.user;

    if (email) {
      const body = req.body;
      // update the d ata
      UserModel.updateOne({email}, body, (err, data) => {
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

export async function generateOTP(req, res) {
  req.app.locals.otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  res.status(201).send({success: "OTP Created Successfully   ", code: req.app.locals.otp});

}

export async function verifyOTP(req, res) {
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

export async function createResetSession(req, res) {
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

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({
        error: "Session Expired", description: "",
        //@ts-ignore
        trace: new Error().stack.split("\n").map(e => e.trim())
      });
    }
    const {email, password} = req.body;
    try {
      UserModel.findOne({email})
        .then((user) => {
            bcrypt.hash(password, saltWorkFactor)
              .then(pHash => {
                UserModel.updateOne({email: user.email}, {password: pHash}, (err, data) => {
                  if (err) throw err;
                  req.app.locals.resetSession = false;
                  return res.status(201).send({success: "Password Updated Successfully"});
                });
              })
              .catch((err) => {
                return res.status(500).send({
                  error: "Unable hash password", description: err,
                  //@ts-ignore
                  trace: new Error().stack.split("\n").map(e => e.trim())
                });
              });
          }
        )
        .catch((err) => {
          return res.status(404).send({
            error: "User not found", description: err,
            //@ts-ignore
            trace: new Error().stack.split("\n").map(e => e.trim())
          });
        });
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

export async function searchUser(req, res) {
  const {searchStr} = req.query;
  console.log(searchStr);
  try {
    if (!searchStr) return res.status(501).send({
      error: "Cannot find users",
      description: "",
      //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
    const regex = new RegExp(`${searchStr}`);
    UserModel.find({name: {$regex: regex}}, (err, users) => {
      if (err) {
        res.status(500).send({
          error: "Cannot find users", description: err,
          //@ts-ignore
          trace: new Error().stack.split("\n").map(d => d.trim()),
        });
      }
      if (!users) {
        return res.status(501).send({
          error: "Couldn't find users", description: "",
          //@ts-ignore
          trace: new Error().stack.split("\n").map(d => d.trim()),
        });
      }
      return res.status(201).send(users);
    });
  } catch (err) {
    return res.status(404).send({
      error: "Cannot find users", description: err, //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

