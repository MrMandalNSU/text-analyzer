import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Text from "../models/textModel";

let createdTextId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await Text.deleteMany({});
  await mongoose.connection.close();
});

describe("Text API Integration Tests", () => {
  it("should create a new text", async () => {
    const res = await request(app).post("/api/texts").send({
      userId: "test_user",
      text: "Hello world. This is a test.",
    });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe("Hello world. This is a test.");
    expect(res.body.userId).toBe("test_user");
    createdTextId = res.body._id;
  });

  it("should fetch all texts", async () => {
    const res = await request(app).get("/api/texts/all");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update the text", async () => {
    const res = await request(app)
      .put(`/api/texts/${createdTextId}`)
      .send({ text: "This is the updated text." });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe("This is the updated text.");
  });

  it("should delete the text", async () => {
    const res = await request(app).delete(`/api/texts/${createdTextId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
