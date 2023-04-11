import UserModel from "../model/user.model.js";
import ChatRequest from "../model/chat.model.js";
import dotenv from "dotenv";

dotenv.config();


export async function requestForChat(req, res) {
  console.log(req.body)
  const {sender, receiver} = req.method === "GET" ? req.query : req.body;
  let status = "pending";
  //check the user's existence
  const exist = await UserModel.findOne({email: receiver});
  if (!exist) return res.status(404).send({
    error: "Cannot Find Email", description: "", //@ts-ignore
    trace: new Error().stack.split("\n").map(d => d.trim()),
  });

  const chatRequestModel = {
    sender,
    receiver,
    status,
  };
  const RequestModel = new ChatRequest(chatRequestModel);
  // return a save result as a Response
  RequestModel.save().then((result) => {
    res.status(201).send({success: "Request sent Successfully"})
  }).catch((err) => {
    res.status(501).send({
      error: "Database Error",
      description: err,
      trace: new Error().stack.split("\n").map(d => d.trim()),
    })
  });
}

//   export async function GetChatRequestResponse(req,res){

//   }

export async function GetChatRequest(req, res) {
  const {email} = req.body;

  try {
    const exist = await ChatRequest.find({receiver: email, status: "pending"});
    const requestData = exist.map((e, i) => {
      const {sender, receiver, status, createdAt} = e;
      return {sender, receiver, status, createdAt};
    })

    res.status(201).send({info: "Fetching User Chat Request", data: requestData});
  } catch (err) {
    return res.status(500).send({
      error: "Error Fetching Request Data", description: err, //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
  }
}

export async function RequestResponse(req, res) {
  try {
    //@ts-ignore
    const {sender, receiver, response} = req.body;

    if (sender && receiver && (response == "Accepted" || response == "Rejected")) {
      // update the d ata
      ChatRequest.updateOne({sender, receiver}, {status: response}, (err, data) => {
        if (err) {
          return res.status(501).send({
            error: "Can not accept request",
            description: err,
            //@ts-ignore
            trace: new Error().stack.split("\n").map(d => d.trim()),
            data
          });
        }
        return res.status(201).send({success: "Request Accepted", data});
      });
    } else {
      return res.status(501).send({
        error: "parameter missing or invalid", description: "", //@ts-ignore
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
