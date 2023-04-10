import mongoose from "mongoose";

const ChatRequestSchema = new mongoose.Schema({
  sender: {type: String, required: [true, "Email is Required"]},
  receiver: {type: String, required: [true, "Email is Required"]},
  status: {type: String, required:[true,"status is required"]},
}, {timestamps: true});

ChatRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
//@ts-ignore
export default mongoose.model("chatRequest", ChatRequestSchema);
