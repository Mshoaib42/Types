import { NextFunction, Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";
import User from "../models/user.model";
import { createError } from "../middlewares/ErrorHandler.middleware";
import { generateOtp, sendOtp } from "../utils/otp";
import fs from "fs";
import path from "path";
import multer from "multer";
import twillo from "twilio";
import { upload, uploadPdfOnly, uploadVideoOnly } from "../utils/multer";
const AccountSid = process.env.TWILIO_ACCOUNT_SID;
const AuthToken = process.env.TWILIO_AUTH_TOKEN;

const client = twillo(AccountSid, AuthToken);
export const registerUser = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const upload = multer({
    storage: multer.memoryStorage(), // Temporarily store files in memory
    fileFilter: (req: any, file: any, cb: any) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "video/mp4",
        "video/mpeg",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false);
      }
    },
  });

  upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "qualificationVideo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ])(req, res, async (err: any) => {
    if (err) {
      return next(createError(400, err.message));
    }

    const { firstName, lastName, email, password, address, phone, role } =
      req.body;

    if (!firstName || !lastName || !password || !email) {
      return next(createError(400, "Please fill all the required fields!"));
    }

    try {
      // Additional validation for mechanics
      // if (role === "mechanic") {
      //   if (!req.files?.["certificate"] || !req.files?.["qualificationVideo"]) {
      //     return next(
      //       createError(
      //         400,
      //         "Mechanics must upload both a certificate and a qualification video."
      //       )
      //     );
      //   }
      // }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Generate OTP for email verification
      const otp = generateOtp();

      // Save the user to the database
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          address,
          phone,
          role,
          image: null, // Will be set after file uploads
          certificate: null, // Will be set after file uploads
          qualificationVideo: null, // Will be set after file uploads
          isActive: role === "mechanic" ? false : true,
          isApproved: role === "mechanic" ? false : true,
          isVerified: false,
          otp,
        },
      });

      if (!created) {
        return next(createError(409, "Email already registered"));
      }

      // Move files to the upload directory
      const uploadDir = "uploads/";
      const certificatePath = req.files?.["certificate"]?.[0];
      const videoPath = req.files?.["qualificationVideo"]?.[0];
      const imagePath = req.files?.["image"]?.[0];

      if (certificatePath) {
        const certificateFileName = Date.now() + "_certificate.pdf";
        fs.writeFileSync(
          path.join(uploadDir, certificateFileName),
          certificatePath.buffer
        );
        user.certificate = certificateFileName;
      }

      if (videoPath) {
        const videoFileName = Date.now() + "_qualificationVideo.mp4";
        fs.writeFileSync(path.join(uploadDir, videoFileName), videoPath.buffer);
        user.qualificationVideo = videoFileName;
      }

      if (imagePath) {
        const imageFileName = Date.now() + "_profileImage.png";
        fs.writeFileSync(path.join(uploadDir, imageFileName), imagePath.buffer);
        user.image = imageFileName;
      }

      // Save the updated user record
      await user.save();

      // Send OTP to the user
      await sendOtp(email, otp);

      res.status(201).json({
        success: true,
        status: 201,
        message:
          "User registered successfully. Please verify your email to activate the account.",
      });
    } catch (error: any) {
      console.error("Error during user registration:", error);
      next(error);
    }
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Please provide email and password"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return next(
        createError(
          403,
          "Account not verified. Please verify your email to activate the account."
        )
      );
    }
    if (user.role === "mechanic" && !user.isApproved) {
      return next(
        createError(
          403,
          "Mechanic approval is pending. Please wait for admin approval."
        )
      );
    }

    // Check if the user account is active
    if (!user.isActive) {
      return next(
        createError(403, "Account is deactivated. Please contact support.")
      );
    }

    // Validate the password
    const isPasswordValid = await comparePassword(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid email or password"));
    }

    // Generate a token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Login successful",
      token,
      data: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// verifyOtp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(createError(400, "Email and OTP are required!"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.otp !== otp) {
      return next(createError(400, "Invalid OTP"));
    }

    // Update user as verified
    user.isVerified = true;
    user.isActive = true;
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Account verified successfully!",
    });
  } catch (error: any) {
    console.error("Error during OTP verification:", error);
    next(error);
  }
};

// resendOtp
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, "Email is required!"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.isVerified) {
      return next(createError(400, "Account is already verified."));
    }

    // Generate a new OTP
    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    // Send the OTP via email
    await sendOtp(email, otp);

    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP has been resent to your email.",
    });
  } catch (error: any) {
    console.error("Error during OTP resend:", error);
    next(error);
  }
};

// forget password
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, "Email is required!"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Generate a new OTP for password reset
    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    // Send the OTP via email
    await sendOtp(email, otp);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password reset OTP has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Error during forget password:", error);
    next(error);
  }
};

// verify otp
export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(createError(400, "Email and OTP are required!"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return next(createError(400, "Invalid OTP"));
    }

    // Clear OTP after verification
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP verified successfully.",
    });
  } catch (error: any) {
    console.error("Error during OTP verification:", error);
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !newPassword) {
    return next(createError(400, "Email, and new password are required!"));
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password and clear the OTP
    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password has been changed successfully.",
    });
  } catch (error: any) {
    console.error("Error during password change:", error);
    next(error);
  }
};

// approve mechanic
export const approveMechanic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const mechanic = await User.findByPk(id);

    if (!mechanic || mechanic.role !== "mechanic") {
      return next(createError(404, "Mechanic not found"));
    }

    mechanic.isApproved = true;
    mechanic.isActive = true; // Now the mechanic can use the system
    await mechanic.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Mechanic approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Mobile

// verify mobile number

export const sendMobileVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { phone } = req.body;

  if (!phone) {
    return next(createError(400, "Phone number is required"));
  }
  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (user.isMobileVerified) {
      return next(createError(400, "Mobile number already verified"));
    }

    // Generate OTP for mobile verification
    const mobileOtp = generateOtp();
    // Assuming your user model has a field called mobileOtp.
    user.mobileOtp = mobileOtp;
    await user.save();

    // Use Twilio to send SMS with the verification code.
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    await client.messages.create({
      body: `Your verification code is: ${mobileOtp}`,
      from: fromPhone,
      to: phone,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Verification code sent via SMS.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMobileNumber = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { phone, code } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.isMobileVerified) {
      return next(createError(400, "Mobile number already verified"));
    }

    // Check if the provided code matches the stored mobileOtp.
    if (user.mobileOtp !== code) {
      return next(createError(400, "Invalid verification code"));
    }

    // Update the user record to mark the mobile number as verified.
    user.isMobileVerified = true;
    user.mobileOtp = null;
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Mobile number verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};
