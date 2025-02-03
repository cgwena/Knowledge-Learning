import { describe, it } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js"; // Assure-toi que ce chemin est correct
import mongoose from "mongoose";
import Cursus from "../models/cursus.js";
import User from "../models/user.js";
import Lesson from "../models/lesson.js";

describe("Cursus Services", () => {
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

  describe("POST /cursus/add", () => {
    it("should create a new cursus", async () => {
      // Créer des leçons pour associer au cursus
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
        lessons: [lesson._id], // Lien vers les leçons créées
      };

      request(app)
        .post("/cursus/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(cursusData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("title", "Test Cursus");
          expect(res.body).to.have.property("price", 199.99);
          expect(res.body.lessons).to.have.lengthOf(1);
        });
    });

    it("should return 400 if title or price is missing", () => {
      const cursusData = {
        price: 199.99,
      };

      request(app)
        .post("/cursus/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(cursusData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(400);
          expect(res.body).to.have.property("error", "Les champs title et price sont requis.");
        });
    });
  });

  describe("GET /cursus", () => {
    it("should return all cursus", () => {
      request(app)
        .get("/cursus")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
        });
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
        lessons: [lesson._id], // Lien vers la leçon
      });
      await cursus.save();

      request(app)
        .get(`/cursus/${cursus._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Test Cursus", price: 199.99 });
          expect(res.body.lessons).to.have.lengthOf(1);
        });
    });

    it("should return 404 if cursus not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .get(`/cursus/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Cursus introuvable.");
        });
    });
  });

  describe("PUT /cursus/:id", () => {
    it("should update a cursus", async () => {
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

      const updatedData = {
        title: "Updated Test Cursus",
        price: 249.99,
        lessons: [lesson._id],
      };

      request(app)
        .put(`/cursus/${cursus._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Updated Test Cursus", price: 249.99 });
        });
    });

    it("should return 404 if cursus to update not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .put(`/cursus/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Test Cursus" })
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Cursus introuvable.");
        });
    });
  });

  describe("DELETE /cursus/:id", () => {
    it("should delete a cursus", async () => {
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

      request(app)
        .delete(`/cursus/${cursus._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("message", "Cursus supprimé avec succès.");
        });
    });

    it("should return 404 if cursus to delete not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .delete(`/cursus/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Cursus introuvable.");
        });
    });
  });
});
