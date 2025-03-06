import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";
import Lesson from "../models/lesson.js";
import User from "../models/user.js";

describe("Lesson Services", () => {
  let adminToken;
  let csrfToken;
  let agent;

  before(async () => {
    await mongoose.connect(process.env.URL_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    agent = request.agent(app);

    const csrfRes = await agent.get("/csrf-token");
    csrfToken = csrfRes.body.csrfToken;

    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
      isActive: true,
    });
    await adminUser.save();

    const loginRes = await agent
      .post("/users/authenticate")
      .set("X-XSRF-TOKEN", csrfToken)
      .send({
        email: "admin@example.com",
        password: "adminpassword123",
      });

    adminToken = loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({ email: /@example\.com$/ });
    await Lesson.deleteMany({ title: /Test/ });
  });

  describe("POST /lessons/add", () => {
    it("should create a new lesson", async () => {
      const lessonData = {
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      };

      const res = await agent
        .post("/lessons/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(lessonData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("title", "Test Lesson");
      expect(res.body).to.have.property("text", "This is a test lesson.");
    });

    it("should return 400 if title is missing", async () => {
      const lessonData = {
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      };

      const res = await agent
        .post("/lessons/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(lessonData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Le champ title est requis.");
    });
  });

  describe("GET /lessons", () => {
    it("should return all lessons", async () => {
      const res = await agent
        .get("/lessons")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /lessons/:id", () => {
    it("should return a lesson by ID", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      const res = await agent
        .get(`/lessons/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ title: "Test Lesson", text: "This is a test lesson." });
    });

    it("should return 404 if lesson not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .get(`/lessons/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Leçon introuvable.");
    });
  });

  describe("PUT /lessons/:id", () => {
    it("should update a lesson", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      const updatedData = {
        title: "Updated Test Lesson",
        text: "This is an updated test lesson.",
        video_url: "http://updatedtestvideo.com",
        price: 79.99,
      };

      const res = await agent
        .put(`/lessons/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(updatedData);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ title: "Updated Test Lesson", text: "This is an updated test lesson." });
    });

    it("should return 404 if lesson to update not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .put(`/lessons/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send({ title: "Updated Test Lesson" });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Leçon introuvable.");
    });
  });

  describe("DELETE /lessons/:id", () => {
    it("should delete a lesson", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      const res = await agent
        .delete(`/lessons/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Leçon supprimée avec succès.");
    });

    it("should return 404 if lesson to delete not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .delete(`/lessons/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Leçon introuvable.");
    });
  });
});
