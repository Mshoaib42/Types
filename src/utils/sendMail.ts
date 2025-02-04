import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_SENDER_NAME,
    pass: process.env.MAIL_SENDER_PASS,
  },
  debug: true,
});

export async function sendMail(email: string, subject: string, body: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Clutch Support" <${process.env.MAIL_SENDER_NAME}>`,
      //   from: `"Clutch" <${process.env.MAIL_SENDER_NAME}>`,
      to: email,
      subject: subject,
      html: body,
    });
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
