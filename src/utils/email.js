import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";

export const sendEmail =async(to,subject,userName='',token)=>{
    const transporter = nodemailer.createTransport({
       service:"gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAILPASSWORD,
        },
      });
    
      const info = await transporter.sendMail({
        from: `"Ghazal-shop 👻" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html:emailTemplate(userName,token)
      });
      return info;
}