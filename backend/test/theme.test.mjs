import { describe, it } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js"; // Assure-toi que ce chemin est correct
import mongoose from "mongoose";
import Theme from "../models/theme.js"; // Assure-toi que ce chemin est correct
import User from "../models/user.js";

describe("Theme Services", () => {
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
    await Theme.deleteMany({ title: /Test/ }); // Supprimer les thèmes de test
    await mongoose.disconnect();
  });

  describe("POST /theme/add", () => {
    it("should create a new theme", () => {
      const themeData = {
        title: "Test Theme",
      };

      request(app)
        .post("/theme/add")
        .set("Authorization", `Bearer ${adminToken}`) // Remplacer avec un token valide si nécessaire
        .send(themeData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("title", "Test Theme");
        });
    });

    it("should return 400 if title is missing", () => {
      const themeData = {};

      request(app)
        .post("/theme/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(themeData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(501);
          expect(res.body.errors.title).to.have.property("message", "Path `title` is required.");
        });
    });
  });

  describe("GET /themes", () => {
    it("should return all themes", () => {
      request(app)
        .get("/theme")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
        });
    });
  });

  describe("GET /theme/:id", () => {
    it("should return a theme by ID", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      request(app)
        .get(`/theme/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Test Theme" });
        });
    });

    it("should return 404 if theme not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .get(`/theme/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Thème introuvable.");
        });
    });
  });

  describe("PUT /theme/:id", () => {
    it("should update a theme", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      const updatedData = {
        title: "Updated Test Theme",
      };

      request(app)
        .put(`/theme/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.include({ title: "Updated Test Theme" });
        });
    });

    it("should return 404 if theme to update not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .put(`/theme/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Test Theme" })
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Thème introuvable.");
        });
    });
  });

  describe("DELETE /theme/:id", () => {
    it("should delete a theme", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      request(app)
        .delete(`/theme/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("message", "Thème supprimé avec succès.");
        });
    });

    it("should return 404 if theme to delete not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      request(app)
        .delete(`/theme/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return (err);

          expect(res.status).to.equal(404);
          expect(res.body).to.have.property("error", "Thème introuvable.");
        });
    });
  });
});
