// const otpEmailTemplate = (otp: string): string => {
//   return `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
//     <h2>Verification Code</h2>
//     <p>Your verification code is:</p>
//     <h3 style="color: #2c3e50;">${otp}</h3>
//     <p>Best regards,</p>
//     <p>Clutch Support Team</p>
//   </div>`;
// };
// export default otpEmailTemplate;
// <div style="text-align: center; margin-bottom: 20px;">
//   <img src="https://ibb.co/Mxj62pSj" alt="Clutch Logo" style="max-width: 120px;">
// </div>
// <p style="color: #555; font-size: 16px; text-align: center; line-height: 1.5;">Please use this code to complete your verification. It is valid for the next 5 minutes.</p>
const otpEmailTemplate = (otp: string): string => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #2c3e50; text-align: center; font-size: 24px; margin-bottom: 20px;">Your verification code is</h2>
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; background-color: #2c3e50; color: #fff; font-size: 24px; padding: 10px 20px; border-radius: 5px;">${otp}</span>
    </div>
    <p style="color: #555; font-size: 16px; text-align: center; line-height: 1.5;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
    <p style="text-align: center; color: #555; font-size: 14px; margin-top: 20px;">Best regards,</p>
    <p style="text-align: center; color: #555; font-size: 14px;">Clutch Support Team</p>
  </div>
  `;
};

export default otpEmailTemplate;
