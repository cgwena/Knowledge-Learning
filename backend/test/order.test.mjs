import { describe, it } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js"; // Assure-toi que ce chemin est correct
import mongoose from "mongoose";
import Order from "../models/order.js";
import Lesson from "../models/lesson.js";
import Cursus from "../models/cursus.js";
import User from "../models/user.js";

describe("Order Services", () => {
  let adminToken;
  let userId;
  let lessonId;
  let cursusId;

  // Avant chaque test, créer un utilisateur admin et récupérer son token
  beforeEach(async () => {
    // Créer un utilisateur de test (admin ou normal)
    const user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "user",
      isActive: true,
    });
    await user.save();
    userId = user._id;

    // Créer une leçon de test
    const lesson = new Lesson({
      title: "Test Lesson",
      text: "text",
      price: 50,
    });
    await lesson.save();
    lessonId = lesson._id;

    // Créer un cursus de test
    const cursus = new Cursus({
      title: "Test Cursus",
      price: 100,
    });
    await cursus.save();
    cursusId = cursus._id;

    // Authentifier l'utilisateur pour obtenir un token
    const loginRes = await request(app)
      .post("/user/authenticate")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    adminToken = loginRes.body.token; // Récupérer le token de l'utilisateur
  });

  // Après chaque test, nettoyer la base de données
  afterEach(async () => {
    await User.deleteMany({ email: /@example\.com$/ }); // Supprimer les utilisateurs test
    await Lesson.deleteMany({ title: /Test/ }); // Supprimer les leçons de test
    await Cursus.deleteMany({ title: /Test/ }); // Supprimer les cursus de test
  });

  // Se connecter à la base de données avant chaque test
  before(async () => {
    await mongoose.connect(process.env.URL_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Se déconnecter de la base de données après chaque test
  after(async () => {
    await mongoose.disconnect();
  });

  describe("POST /order", () => {
    it("should create a new order", async () => {
      const orderData = {
        items: [
          { type: "lesson", itemId: lessonId },
          { type: "cursus", itemId: cursusId },
        ],
      };

      request(app)
        .post("/order")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(orderData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("totalPrice", 150); // Total price should be lesson price + cursus price
          expect(res.body.items).to.have.lengthOf(2);
        });
    });

    it("should return 400 if item type is invalid", async () => {
      const orderData = {
        items: [
          { type: "invalidType", itemId: lessonId },
        ],
      };

      request(app)
        .post("/order")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(orderData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(500);
          expect(res.body).to.have.property("error", "Type d’élément invalide.");
        });
    });

    it("should return 404 if lesson or cursus is not found", async () => {
      const invalidLessonId = new mongoose.Types.ObjectId();
      const orderData = {
        items: [
          { type: "lesson", itemId: invalidLessonId },
        ],
      };

      request(app)
        .post("/order")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(orderData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(500);
          expect(res.body).to.have.property("error", `Leçon introuvable avec l'ID: ${invalidLessonId}`);
        });
    });
  });

  describe("GET /order/user/:userId", () => {
    it("should return all orders by userId", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      request(app)
        .get(`/order/user/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0].totalPrice).to.equal(50);
        });
    });
  });

  describe("GET /order/:orderId", () => {
    it("should return an order by ID", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      request(app)
        .get(`/order/${order._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ totalPrice: 50 });
        });
    });

    it("should return 404 if order not found", async () => {
      const invalidOrderId = new mongoose.Types.ObjectId();

      request(app)
        .get(`/order/${invalidOrderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Order not found");
        });
    });
  });

  describe("PUT /order/:orderId", () => {
    it("should update the status of an order", async () => {
      const order = new Order({
        user: userId,
        items: [{ type: "lesson", itemId: lessonId, price: 50 }],
        totalPrice: 50,
      });
      await order.save();

      request(app)
        .put(`/order/${order._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "shipped" })
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal("shipped");
        });
    });

    it("should return 404 if order to update not found", async () => {
      const invalidOrderId = new mongoose.Types.ObjectId();

      request(app)
        .put(`/order/${invalidOrderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "shipped" })
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Commande introuvable.");
        });
    });
  });
});
