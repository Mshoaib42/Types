import request from "supertest";
import { app } from "../index";
import sequelize from "../config/db";
import { token } from "../constants/userRoles";
import User from "../models/user.model";

let testUserId: number;

jest.mock("../utils/jwtUtils", () => ({
  verifyToken: jest.fn(() => ({
    id: 1,
    role: "admin",
  })),
}));

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create test user & store correct ID
  const testUser = await User.create({
    firstName: "zain",
    lastName: "waseem",
    email: "zainwaseem9371@gmail.com",
    password: "hashedpassword",
    role: "mechanic",
  });

  testUserId = testUser.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Routes - DELETE /api/v1/users/:id", () => {
  test("✅ Success - Delete an existing user", async () => {
    const response = await request(app)
      .delete(`/api/v1/users/${testUserId}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User deleted successfully");

    // Verify user is deleted
    const checkUser = await User.findByPk(testUserId);
    expect(checkUser).toBeNull();
  });
});
