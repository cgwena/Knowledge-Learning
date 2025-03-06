import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";
import Cursus from "../models/cursus.js";
import User from "../models/user.js";
import Lesson from "../models/lesson.js";

describe("Cursus Services", () => {
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
    await Cursus.deleteMany({ title: /Test/ });
    await Lesson.deleteMany({ title: /Test Lesson/ });
  });

  describe("POST /cursus/add", () => {
    it("should create a new cursus", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      const cursusData = {
        title: "Test Cursus",
        price: 199.99,
        lessons: [lesson._id],
      };

      const res = await agent
        .post("/cursus/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(cursusData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("title", "Test Cursus");
      expect(res.body).to.have.property("price", 199.99);
      expect(res.body.lessons).to.have.lengthOf(1);
    });

    it("should return 400 if title or price is missing", async () => {
      const cursusData = {
        price: 199.99,
      };

      const res = await agent
        .post("/cursus/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(cursusData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Les champs title et price sont requis.");
    });
  });

  describe("GET /cursus", () => {
    it("should return all cursus", async () => {
      const res = await agent
        .get("/cursus")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-CSRF-Token", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /cursus/:id", () => {
    it("should return a cursus by ID", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      const cursus = new Cursus({
        title: "Test Cursus",
        price: 199.99,
        lessons: [lesson._id],
      });
      await cursus.save();

      const res = await agent
        .get(`/cursus/${cursus._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ title: "Test Cursus", price: 199.99 });
      expect(res.body.lessons).to.have.lengthOf(1);
    });

    it("should return 404 if cursus not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .get(`/cursus/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Cursus introuvable.");
    });
  });
});
