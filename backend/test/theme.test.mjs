import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";
import Theme from "../models/theme.js";
import User from "../models/user.js";

describe("Theme Services", () => {
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

    // Récupérer le token CSRF
    const csrfRes = await agent.get("/csrf-token");
    csrfToken = csrfRes.body.csrfToken;

    // Créer un utilisateur admin
    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
      isActive: true,
    });
    await adminUser.save();

    // Authentifier l'utilisateur pour obtenir un token d'authentification
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
    // Nettoyer la base de données après chaque test
    await User.deleteMany({ email: /@example\.com$/ });
    await Theme.deleteMany({ title: /Test/ });
  });

  describe("POST /themes/add", () => {
    it("should create a new theme", async () => {
      const themeData = {
        title: "Test Theme",
      };

      const res = await agent
        .post("/themes/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(themeData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("title", "Test Theme");
    });
  });

  describe("GET /themes", () => {
    it("should return all themes", async () => {
      const res = await agent
        .get("/themes")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /themes/:id", () => {
    it("should return a theme by ID", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      const res = await agent
        .get(`/themes/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ title: "Test Theme" });
    });

    it("should return 404 if theme not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .get(`/themes/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Thème introuvable.");
    });
  });

  describe("PUT /themes/:id", () => {
    it("should update a theme", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      const updatedData = {
        title: "Updated Test Theme",
      };

      const res = await agent
        .put(`/themes/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(updatedData);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ title: "Updated Test Theme" });
    });

    it("should return 404 if theme to update not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .put(`/themes/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send({ title: "Updated Test Theme" });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Thème introuvable.");
    });
  });

  describe("DELETE /themes/:id", () => {
    it("should delete a theme", async () => {
      const theme = new Theme({
        title: "Test Theme",
      });
      await theme.save();

      const res = await agent
        .delete(`/themes/${theme._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Thème supprimé avec succès.");
    });

    it("should return 404 if theme to delete not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .delete(`/themes/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Thème introuvable.");
    });
  });
});
