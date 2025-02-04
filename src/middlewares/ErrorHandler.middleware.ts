import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR]: ${message}`);
  console.error(`[STATUS CODE]: ${statusCode}`);
  if (err.stack) {
    const stackLines = err.stack.split("\n");
    if (stackLines[2]) {
      console.error(`[STACK TRACE]: ${stackLines[2].trim()}`);
    }
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

// Utility to create custom errors
export const createError = (statusCode: number, message: string): Error => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};
