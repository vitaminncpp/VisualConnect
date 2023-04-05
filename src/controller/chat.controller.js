import UserModel from "../model/user.model.js";
import ChatRequest from "../model/chat.model.js";

export async function chatRequest(req,res){

    const {sender,receiver} = req.method === "GET" ? req.query : req.body;
    let status = "pending";
    //check the user's existence
    const exist = await UserModel.findOne({receiver});
    if (!exist) return res.status(404).send({
      error: "Cannot Find Email", description: "", //@ts-ignore
      trace: new Error().stack.split("\n").map(d => d.trim()),
    });
    
    const chatRequestModel = {
        sender,
        receiver,
        status,
      };
      const RequestModel = new chatRequest(chatRequestModel);
      // return a save result as a Response
      RequestModel.save();

      res.status(201).send({success: "Request has been sent!",});
    
  }

//   export async function GetChatRequestResponse(req,res){

//   }

//   export async function GetChatRequest(req,res){

//   }