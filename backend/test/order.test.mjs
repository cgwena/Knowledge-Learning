import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Lesson from "../models/lesson.js";
import Cursus from "../models/cursus.js";
import User from "../models/user.js";

describe("Order Services", () => {
  let adminToken;
  let csrfToken;
  let agent;
  let userId;
  let lessonId;
  let cursusId;

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

    const user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
      isActive: true,
    });
    await user.save();
    userId = user._id;

    const lesson = new Lesson({
      title: "Test Lesson",
      text: "text",
      price: 50,
    });
    await lesson.save();
    lessonId = lesson._id;

    const cursus = new Cursus({
      title: "Test Cursus",
      price: 100,
    });
    await cursus.save();
    cursusId = cursus._id;

    const loginRes = await agent
      .post("/users/authenticate")
      .set("X-XSRF-TOKEN", csrfToken)
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    adminToken = loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({ email: /@example\.com$/ });
    await Lesson.deleteMany({ title: /Test/ });
    await Cursus.deleteMany({ title: /Test/ });
  });

  describe("POST /orders", () => {
    it("should create a new order", async () => {
      const orderData = {
        items: [
          { type: "lesson", itemId: lessonId },
          { type: "cursus", itemId: cursusId },
        ],
      };

      const res = await agent
        .post("/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(orderData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("totalPrice", 150);
      expect(res.body.items).to.have.lengthOf(2);
    });

    it("should return 400 if item type is invalid", async () => {
      const orderData = {
        items: [
          { type: "invalidType", itemId: lessonId },
        ],
      };

      const res = await agent
        .post("/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(orderData);

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("error", "Type d’élément invalide.");
    });

    it("should return 404 if lesson or cursus is not found", async () => {
      const invalidLessonId = new mongoose.Types.ObjectId();
      const orderData = {
        items: [
          { type: "lesson", itemId: invalidLessonId },
        ],
      };

      const res = await agent
        .post("/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(orderData);

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("error", `Leçon introuvable avec l'ID: ${invalidLessonId}`);
    });
  });

  describe("GET /orders/user/:userId", () => {
    it("should return all orders by userId", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      const res = await agent
        .get(`/orders/user/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0].totalPrice).to.equal(50);
    });
  });

  describe("GET /orders/:orderId", () => {
    it("should return an order by ID", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      const res = await agent
        .get(`/orders/${order._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ totalPrice: 50 });
    });

    it("should return 404 if order not found", async () => {
      const invalidOrderId = new mongoose.Types.ObjectId();

      const res = await agent
        .get(`/orders/${invalidOrderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Order not found");
    });
  });

  describe("PUT /orders/:orderId", () => {
    it("should update the status of an order", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      const res = await agent
        .put(`/orders/${order._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send({ status: "shipped" });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("shipped");
    });

    it("should return 404 if order to update not found", async () => {
      const invalidOrderId = new mongoose.Types.ObjectId();

      const res = await agent
        .put(`/orders/${invalidOrderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send({ status: "shipped" });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Commande introuvable.");
    });
  });
});
