import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  filterUsersByRole,
  searchUsers,
  getDeletedUsers,
  getBlockedUsers,
  getActiveUsers,
  blockUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { hasRole, isAuthenticated } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/validationUtils";
import { paramsIdSchema } from "../helpers/paramsIdSchema";

const router = Router();

// User Protected routes API Endpoints
router.get("/all", isAuthenticated, hasRole(["admin"]), getAllUsers);

// Filter users by role
router.get("/search", isAuthenticated, searchUsers);

// Filter users by role
router.get("/filter/", isAuthenticated, filterUsersByRole);
// Get all active users
router.get("/active", isAuthenticated, getActiveUsers);

// Get all blocked users
router.get("/blocked", isAuthenticated, hasRole(["admin"]), getBlockedUsers);

// Get all soft-deleted users
router.get("/deleted", isAuthenticated, hasRole(["admin"]), getDeletedUsers);

router.put("/block/:id", isAuthenticated, blockUser);
// router.post("/profile-photo/:id", isAuthenticated, uploadProfilePhoto);

router.patch(
  "/profile/:id",
  isAuthenticated,
  validateRequest(paramsIdSchema, "params"),
  updateUserProfile
);
router.get(
  "/:id",
  isAuthenticated,
  validateRequest(paramsIdSchema, "params"),
  getUserById
);

router.delete(
  "/:id",
  isAuthenticated,
  validateRequest(paramsIdSchema, "params"),
  deleteUser
);

export default router;
