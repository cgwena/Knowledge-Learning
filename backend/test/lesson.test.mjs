import { describe, it } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js"; // Assure-toi que ce chemin est correct
import mongoose from "mongoose";
import Lesson from "../models/lesson.js";
import User from "../models/user.js";


describe("Lesson Services", () => {
    let adminToken;

  // Avant chaque test, créer un utilisateur admin et récupérer son token
  beforeEach(async () => {
    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
      isActive: true,
    });

    await adminUser.save();

    // Authentifier l'utilisateur pour obtenir un token
    const loginRes = await request(app)
      .post("/user/authenticate")
      .send({
        email: "admin@example.com",
        password: "adminpassword123",
      });

    adminToken = loginRes.body.token; // Récupérer le token de l'utilisateur admin
  });

  // Après chaque test, nettoyer la base de données
  afterEach(async () => {
    await User.deleteMany({ email: /@example\.com$/ }); // Supprimer les utilisateurs test
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
    await Lesson.deleteMany({ title: /Test/ }); // Supprimer les leçons de test
    await mongoose.disconnect();
  });

  describe("POST /lesson/add", () => {
    it("should create a new lesson", () => {
      const lessonData = {
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      };

      request(app)
        .post("/lesson/add")
        .set("Authorization", `Bearer ${adminToken}`) // Remplacer avec un token valide si nécessaire
        .send(lessonData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("title", "Test Lesson");
          expect(res.body).to.have.property("text", "This is a test lesson.");
        });
    });

    it("should return 400 if title is missing", () => {
      const lessonData = {
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      };

      request(app)
        .post("/lesson/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(lessonData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(400);
          expect(res.body).to.have.property("error", "Le champs title est requis.");
        });
    });
  });

  describe("GET /lessons", () => {
    it("should return all lessons", () => {
      request(app)
        .get("/lesson")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
        });
    });
  });

  describe("GET /lesson/:id", () => {
    it("should return a lesson by ID", async () => {
      const lesson = new Lesson({
        title: "Test Lesson",
        text: "This is a test lesson.",
        video_url: "http://testvideo.com",
        price: 99.99,
      });
      await lesson.save();

      request(app)
        .get(`/lesson/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Test Lesson", text: "This is a test lesson." });
        });
    });

    it("should return 404 if lesson not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .get(`/lesson/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Leçon introuvable.");
        });
    });
  });

  describe("PUT /lesson/:id", () => {
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

      request(app)
        .put(`/lesson/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Updated Test Lesson", text: "This is an updated test lesson." });
        });
    });

    it("should return 404 if lesson to update not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .put(`/lesson/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Test Lesson" })
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Leçon introuvable.");
        });
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

      request(app)
        .delete(`/lesson/${lesson._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("message", "Leçon supprimée avec succès.");
        });
    });

    it("should return 404 if lesson to delete not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .delete(`/lesson/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Leçon introuvable.");
        });
    });
  });
});
