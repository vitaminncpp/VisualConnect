import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from "config";
import {promises} from "dns";

export interface UserDocument extends mongoose.Document {
  email: string,
  name: string,
  password: string,
  createdAt: Date,
  updatedAt: Date,

  comparePassword(candidatePassword: string): Promise<boolean>,
}

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
}, {timestamps: true});

UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
  const hash = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;