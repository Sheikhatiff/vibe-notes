import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/user.model.js";
import Note from "../models/note.model.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const DB_URI = process.env.TEST_DATABASE_URI.replace(
  "<DB_PASS>",
  process.env.DB_PASS
);

let token;
let noteId;

beforeAll(async () => {
  // connect to test DB
  await mongoose.connect(DB_URI);

  // create test user if not exists
  const userExists = await User.findOne({ email: "test@example.com" });
  if (!userExists) {
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "12345678",
    });
  }

  // login
  const res = await request(app).post("/api/v1/auth/login").send({
    email: "test@example.com",
    password: "12345678",
  });

  console.log("Login response:", res.body); // debug
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Notes API", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        note: "This is a test note",
        type: "quick",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.note.title).toBe("Test Note");
    noteId = res.body.data.note._id;
  });

  it("should get all notes", async () => {
    const res = await request(app)
      .get("/api/v1/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.notes.length).toBeGreaterThan(0);
  });

  it("should get a specific note", async () => {
    const res = await request(app)
      .get(`/api/v1/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.note._id).toBe(noteId);
  });

  it("should update a note", async () => {
    const res = await request(app)
      .patch(`/api/v1/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Note" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.note.title).toBe("Updated Note");
  });

  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
