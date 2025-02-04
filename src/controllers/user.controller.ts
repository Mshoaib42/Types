import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { createError } from "../middlewares/ErrorHandler.middleware";
import { Op } from "sequelize";
import { uploadImageOnly } from "../utils/multer";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page

  try {
    const result = await User.paginate(page, limit);

    // Check if there are any users
    if (!result.items || result.items.length === 0) {
      return next(createError(404, "No users found"));
    }

    // Remove sensitive data (e.g., password)
    const sanitizedUsers = result.items.map((user: any) => {
      const { password, ...sanitizedUser } = user.toJSON();
      return sanitizedUser;
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users retrieved successfully",
      users: sanitizedUsers,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate the ID parameter
    if (!id || isNaN(Number(id))) {
      return next(createError(400, "Invalid or missing user ID"));
    }

    // Find the user by ID
    const user = await User.findByPk(id);

    // Check if the user exists
    if (!user) {
      return next(createError(404, `User with ID ${id} not found`));
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Delete user

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(Number(id))) {
    return next(createError(400, "Invalid or missing user ID"));
  }

  try {
    // Check if the user exists
    const user = await User.findByPk(id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    // Handle database or server errors
    if (error.name === "SequelizeDatabaseError") {
      return next(createError(500, "Database error occurred"));
    }
    next(error);
  }
};

// Search Users

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;

    if (!query) {
      return next(createError(400, "Query parameter is required"));
    }
    console.log(query);
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });
    console.log(users);
    if (!users.length) {
      return next(createError(404, "No users found"));
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Filter users by role
export const filterUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.query;

    if (!role) {
      return next(createError(400, "Role parameter is required"));
    }

    const users = await User.findAll({ where: { role } });

    if (!users.length) {
      return next(createError(404, "No users found with the specified role"));
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get all deleted (soft deleted) users
export const getDeletedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll({
      where: { deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });

    if (!users.length) {
      return next(createError(404, "No deleted users found"));
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Deleted users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get all active users
export const getActiveUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll({
      where: {
        isBlocked: false,
        isActive: true,
      },
    });

    if (!users || users.length === 0) {
      return next(createError(404, "No active users found"));
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Active users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get all blocked users

export const getBlockedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll({
      where: {
        isBlocked: true,
      },
    });

    if (!users || users.length === 0) {
      return next(createError(404, "No blocked users found"));
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Blocked users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to block a user
export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "User blocked successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  uploadImageOnly.single("image")(req, res, async (err: any) => {
    if (err) {
      return next(createError(400, err.message));
    }

    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = { ...req.body };

      // Ensure the authenticated user can update only their own profile
      if (Number(id) !== userId) {
        return next(
          createError(403, "You are not authorized to update this profile.")
        );
      }

      // Find the user by ID
      const user = await User.findByPk(id);
      if (!user) {
        return next(createError(404, "User not found"));
      }

      if (updateData.email && updateData.email !== user.email) {
        return next(createError(400, "Email cannot be changed."));
      }

      if (req.file) {
        updateData.image = req.file.filename;
      }

      await user.update(updateData);

      res.status(200).json({
        success: true,
        status: 200,
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      // Handle Sequelize validation errors for unique constraints (e.g., email)
      if (error.name === "SequelizeUniqueConstraintError") {
        return next(
          createError(
            400,
            error.errors[0]?.message || "Unique constraint error"
          )
        );
      }

      next(error);
    }
  });
};
