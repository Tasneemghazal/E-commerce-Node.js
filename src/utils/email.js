import nodemailer from "nodemailer";

export const sendEmail =async(to,subject,html)=>{
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
        html
      });
      return info;
}