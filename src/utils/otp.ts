import { randomInt } from "crypto";
import { sendMail } from "./sendMail";
import otpEmailTemplate from "../templates/emailOTP";

export const generateOtp = (): string => {
  return randomInt(1000, 9999).toString(); // 4 digit OTP generation
};

export const sendOtp = async (email: string, otp: string): Promise<void> => {
  const subject = "Clutch OTP";
  const body = otpEmailTemplate(otp);
  await sendMail(email, subject, body);
};
