import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";
import { createError } from "../middlewares/ErrorHandler.middleware";

export const isAuthenticated = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Authentication token is missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, "Invalid or expired token"));
  }
};

// Middleware to check if the user has required roles
export const hasRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return next(
        createError(403, "You do not have permission to access this resource")
      );
    }
    next();
  };
};
