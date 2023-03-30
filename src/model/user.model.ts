import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fName: {type: String, required: [true, "First Name is Required"]},
  lName: {type: String, required: [true, "Last Name is Required"]},
  username: {type: String, required: [true, "username is Required"], unique: [true, "username must be unique"]},
  email: {type: String, required: [true, "Email is Required"], unique: [true, "Email must be unique"]},
  password: {type: String, required: [true, "Password is Required"]},
  profile:{type:String},
  mobile: {type: Number, required: [true, "Mobile No is required"], unique: [true, "Mobile No must be unique"]},
  address: {type: String},
}, {timestamps: true});

//@ts-ignore
export default mongoose.model.Users || mongoose.model("users", UserSchema);
