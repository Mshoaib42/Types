import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET as Secret, {
    expiresIn: "2d",
  });
};

// Function to verify a JWT token
export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, JWT_SECRET as Secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
