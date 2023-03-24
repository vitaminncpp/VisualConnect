import {Request, Response} from "express";
import {createUser} from "../service/user.service";
import {omit} from "lodash";
import log from '../logger'

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    //@ts-ignore
    return res.send(omit(user.toJSON(), 'password'))
  } catch (err) {
    //@ts-ignore
    log(err)
    //@ts-ignore
    return res.status(409).send(err.message);
  }

}





