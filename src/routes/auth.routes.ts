import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  changePassword,
  forgetPassword,
  verifyForgotPasswordOtp,
  approveMechanic,
  sendMobileVerificationCode,
  verifyMobileNumber,
} from "../controllers/auth.controller";
import { Router } from "express";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../helpers/userSchemas";
import { hasRole } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/validationUtils";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

// User Authentication routes API Endpoints
router.post(
  "/register",
  // validateRequest(userRegistrationSchema, "body"),
  registerUser
);
router.post(
  "/login",
  // validateRequest(userLoginSchema, "body"),

  loginUser
);

router.patch(
  "/approve-mechanic/:id",
  isAuthenticated,
  hasRole(["admin"]),
  approveMechanic
);

router.post("/account-otp-verify", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/forget-password", forgetPassword);
router.post("/forget-otp-verify", verifyForgotPasswordOtp);
router.post("/change-password", changePassword);

// Mobile Number Verification
router.post("/send-verification-code", sendMobileVerificationCode);
router.post("/verify-mobile-number", verifyMobileNumber);

export default router;
