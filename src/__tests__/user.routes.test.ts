// Success - Get all users as admin ✅
// Failure - Unauthorized access (missing token) ✅
// Validation - Invalid token format ✅
import request from "supertest";
import { app } from "../index";
import sequelize from "../config/db";
import { token } from "../constants/userRoles";
import User from "../models/user.model";

// Mock the verifyToken function
jest.mock("../utils/jwtUtils", () => ({
  verifyToken: jest.fn(() => ({
    id: 1,
    role: "admin",
  })),
}));

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Ensures a clean database for each test run

  // Create a test user
  await User.create({
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "hashedpassword",
    role: "admin",
  });
});

afterAll(async () => {
  await User.destroy({ where: {}, truncate: true });
  await sequelize.close();
});
describe("User Routes - /api/v1/users/all", () => {
  test("Success - Get all users as admin", async () => {
    const response = await request(app)
      .get("/api/v1/users/all")
      .set("Authorization", token);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Users retrieved successfully");
  });

  test("Failure - Unauthorized access (missing token)", async () => {
    const response = await request(app).get("/api/v1/users/all");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Authentication token is missing or invalid"
    );
  });

  test("Validation - Invalid token format", async () => {
    const response = await request(app)
      .get("/api/v1/users/all")
      .set("Authorization", "InvalidTokenFormat");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Authentication token is missing or invalid"
    );
  });
});
