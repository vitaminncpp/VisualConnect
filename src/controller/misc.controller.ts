import {Request, Response} from "express";
import {string} from "yup";
import {stringify} from "querystring";

export async function healthcheck(req: Request, res: Response) {
  res.send(`<h1>Everything Works fine !</h1>`);
}