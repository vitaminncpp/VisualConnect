import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {type: String, required: [true, "Name is Required"]},
  email: {type: String, required: [true, "Email is Required"], unique: [true, "Email must be unique"]},
  password: {type: String, required: [true, "Password is Required"]},
  mobile: {type: Number, required: [true, "Mobile No is required"], unique: [true, "Mobile No must be unique"]},
}, {timestamps: true});

//@ts-ignore
export default mongoose.model.Users || mongoose.model("users", UserSchema);
