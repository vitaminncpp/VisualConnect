import config from "config";
import nodemailer from 'nodemailer';
import Mailgen from "mailgen";
import {Request, Response} from "express";

const nodeConfig = {
  host: config.get("MAIL_HOST") as string,
  port: config.get("MAIL_PORT") as number,
  auth: {
    user: config.get("EMAIL") as string,
    pass: config.get("MAIL_PASSWORD") as string,
  }
};

const transporter = nodemailer.createTransport(nodeConfig);
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "MailGen",
    link: "https://mailgen.js",
  }
})

export const mail = async function (body: { name: string, email: string, subject: string, text: string, }) {
  const {name, email, subject, text,} = body;
  const mail = {
    body: {
      name: name,
      intro: text || `Hello ${name} !`,
      outro: "Need help or have questions ? Just replay to this Email."
    }
  }
  const emailBody = mailGenerator.generate(mail)
  const message = {
    from: nodeConfig.auth.user,
    to: body.email
  }
}


