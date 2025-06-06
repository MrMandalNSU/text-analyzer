import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Text from "../models/textModel";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await Text.deleteMany({});
  await mongoose.connection.close();
});

describe("Text API", () => {
  let textId = "";

  it("should create a new text", async () => {
    const res = await request(app)
      .post("/api/texts")
      .send({ userId: "user1", text: "Hello world." });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe("Hello world.");
    textId = res.body._id;
  });

  it("should get all texts", async () => {
    const res = await request(app).get("/api/texts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a text", async () => {
    const res = await request(app)
      .put(`/api/texts/${textId}`)
      .send({ text: "Updated text content." });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe("Updated text content.");
  });

  it("should delete a text", async () => {
    const res = await request(app).delete(`/api/texts/${textId}`);
    expect(res.status).toBe(200);
  });
});
