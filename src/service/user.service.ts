import User, {UserDocument} from "../model/user.model";
import {DocumentDefinition} from "mongoose";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(input);
  } catch (err) {

  }
}

function findUser() {

}