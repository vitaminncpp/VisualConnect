import mongoose from "mongoose";

const ChatRequestSchema = new mongoose.Schema({
  sender: {type: String, required: [true, "Email is Required"], unique: [true, "Email must be unique"]},
  receiver: {type: String, required: [true, "Email is Required"], unique: [true, "Email must be unique"]},
  status: {type: String, required:[true,"status is required"]},
}, {timestamps: true});

//@ts-ignore
export default mongoose.model("chatRequest", ChatRequestSchema);
