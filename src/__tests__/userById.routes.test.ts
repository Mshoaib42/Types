// Tests for `/api/v1/users/:id`
import request from "supertest";
import { app } from "../index";
import sequelize from "../config/db";
import { token } from "../constants/userRoles";
import User from "../models/user.model";

jest.mock("../utils/jwtUtils", () => ({
  verifyToken: jest.fn(() => ({
    id: 1,
    role: "admin",
  })),
}));

beforeAll(async () => {
  await sequelize.sync({ force: true }); // ✅ Ensures a clean database
  await User.create({
    id: 31,
    firstName: "zain",
    lastName: "waseem",
    email: "zainwaseem9371@gmail.com",
    password: "hashedpassword",
    role: "mechanic",
  });
});

afterAll(async () => {
  await sequelize.close(); // ✅ Closes DB after tests
});

describe("User Routes - /api/v1/users/:id", () => {
  test("Success - Retrieve a user by valid ID", async () => {
    const response = await request(app)
      .get("/api/v1/users/31")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User retrieved successfully");
    expect(response.body.data).toHaveProperty("id", 31);
  });

  test("Failure - User ID not found", async () => {
    const response = await request(app)
      .get("/api/v1/users/999") // ✅ Use a non-existing ID
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User with ID 999 not found");
  });

  test("Failure - Invalid user ID format", async () => {
    const response = await request(app)
      .get("/api/v1/users/abc")
      .set("Authorization", token);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid or missing user ID");
  });

  test("Failure - Missing Authorization token", async () => {
    const response = await request(app).get("/api/v1/users/31");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Authentication token is missing or invalid"
    );
  });
});
