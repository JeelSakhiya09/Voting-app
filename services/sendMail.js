import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transport = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS_KEY,
  },
});

export async function sendMailFN(email, subject, text) {
  const mailOption = {
    from: process.env.EMAIL_ID,
    to: email,
    subject,
    text,
  };
  transport.sendMail(mailOption, function (err, info){
    if (err) {
      return console.log("Error ::> ", err);
    }

    console.log("OTP sended successfully ::> ", info.response);
  });
}
