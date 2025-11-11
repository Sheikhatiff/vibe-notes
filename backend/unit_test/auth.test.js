import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";

dotenv.config({ path: "./config.env" });
const DB_URI = process.env.TEST_DATABASE_URI.replace(
  "<DB_PASS>",
  process.env.DB_PASS
);
beforeAll(async () => {
  await mongoose.connect(DB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

//  Test Signup
describe("POST /api/v1/auth/signup", () => {
  it("should signup a new user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "12345678",
      passwordConfirm: "12345678",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("test@example.com");
  });
});

// Test Login
describe("POST /api/v1/auth/login", () => {
  it("should login existing user with correct credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "12345678",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(400);
  });
});

//  Test Logout
describe("GET /api/v1/auth/logout", () => {
  it("should clear cookie and logout", async () => {
    const res = await request(app).get("/api/v1/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/logged out/i);
  });
});
describe("Auth Tests", () => {
  test("dummy test", () => {
    expect(true).toBe(true);
  });
});
