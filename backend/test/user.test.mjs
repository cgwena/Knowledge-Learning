import { describe, it, before, after, beforeEach, afterEach } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

describe("User Services", () => {
  let adminToken, nonAdminToken, csrfToken, agent;

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

    // Create admin user and get token
    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "Adminpassword123&",
      role: "admin",
      isActive: true,
    });
    await adminUser.save();
    

    const adminLoginRes = await agent
      .post("/users/authenticate")
      .set("X-XSRF-TOKEN", csrfToken)
      .send({
        email: "admin@example.com",
        password: "Adminpassword123&",
      });
    adminToken = adminLoginRes.body.token;

    // Create non-admin user and get token
    const nonAdminUser = new User({
      name: "NonAdmin",
      email: "nonadmin@example.com",
      password: "Userpassword123&",
      role: "user",
      isActive: true,
    });
    await nonAdminUser.save();

    const nonAdminLoginRes = await agent
      .post("/users/authenticate")
      .set("X-XSRF-TOKEN", csrfToken)
      .send({
        email: "nonadmin@example.com",
        password: "Userpassword123&",
      });
    nonAdminToken = nonAdminLoginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({ email: /@example\.com$/ });
  });

  describe("User Registration", () => {
    let saveStub, findOneStub, transporterStub, sendMailStub;

    beforeEach(() => {
      findOneStub = sinon.stub(User, "findOne").resolves(null);
      saveStub = sinon.stub(User.prototype, "save").resolves({ _id: 'some-id' });
      sendMailStub = sinon.stub().resolves();
      transporterStub = sinon.stub(nodemailer, "createTransport").returns({
        sendMail: sendMailStub,
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should register a new user and send a confirmation email", async () => {
      const userData = {
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123!",
      };

      const res = await agent
        .post("/users/register")
        .set("X-XSRF-TOKEN", csrfToken)
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal(
        "Inscription réussie. Vérifiez votre e-mail pour confirmer votre compte."
      );

      sinon.assert.calledOnce(saveStub);
      sinon.assert.calledOnce(sendMailStub);
      sinon.assert.calledWith(sendMailStub, sinon.match({
        from: process.env.EMAIL_USER,
        to: "testuser@example.com",
        subject: "Confirmation de votre inscription",
        html: sinon.match(/http:\/\/localhost:8080\/confirm\?token=\S+/),
      }));
    });



    it("should return 400 if email already exists", async () => {
      findOneStub.resolves({ email: "testuser@example.com" });

      const res = await agent
        .post("/users/register")
        .set("X-XSRF-TOKEN", csrfToken)
        .send({
          name: "Test User",
          email: "testuser@example.com",
          password: "Password123!",
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Email déjà enregistré.");
    });

    it("should return 400 if password is invalid", async () => {
      const res = await agent
        .post("/users/register")
        .set("X-XSRF-TOKEN", csrfToken)
        .send({
          name: "Test User",
          email: "testuser@example.com",
          password: "weakpass",
        });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
    });
  });

  describe.only("User Authentication", () => {
    let findOneStub, compareStub;

    beforeEach(() => {
      findOneStub = sinon.stub(User, "findOne").returns({
        _id: "user_id",
        email: "testuser@example.com",
        password: bcrypt.hash("Password123!", 10),
        role: "user",
        isActive: true,
      });

      compareStub = sinon.stub(bcrypt, "compare").resolves(true);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should authenticate the user and return a token", async () => {
      const res = await agent
        .post("/users/authenticate")
        .set("X-XSRF-TOKEN", csrfToken)
        .send({
          email: "testuser@example.com",
          password: "Password123!",
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Authenticate_succeed");
      expect(res.body).to.have.property("token");
    });

    it("should return 403 if password is invalid", async () => {
      compareStub.resolves(false);

      const res = await agent
        .post("/users/authenticate")
        .set("X-XSRF-TOKEN", csrfToken)
        .send({
          email: "testuser@example.com",
          password: "wrongpassword",
        });

      expect(res.status).to.equal(403);
      expect(res.body.error).to.equal("Invalid credentials");
    });

    it("should return 404 if user not found", async () => {
      findOneStub.returns(null);

      const res = await agent
        .post("/users/authenticate")
        .set("X-XSRF-TOKEN", csrfToken)
        .send({
          email: "nonexistent@example.com",
          password: "Password123!",
        });

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal("User not found");
    });
  });

  describe("GET /users", () => {
    it("should return all users if admin", async () => {
      const user = new User({
        name: "John",
        firstname: "Doe",
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123&", 10),
        role: "admin",
        isActive: true,
      });
      await user.save();

      const res = await agent
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.length.greaterThan(0);
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by ID if admin", async () => {
      const user = new User({
        name: "Jane",
        firstname: "Doe",
        email: "jane.doe@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin",
      });
      await user.save();

      const res = await agent
        .get(`/users/${user._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ name: "Jane", firstname: "Doe" });
    });

    it("should return 404 if user not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .get(`/users/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(404);
      expect(res.body).to.equal("user not found");
    });
  });

  describe("POST /users/add", () => {
    it("should create a new user if admin", async () => {
      const userData = {
        name: "Alice",
        firstname: "Smith",
        email: "alice.smith@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      };

      const res = await agent
        .post("/users/add")
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(userData);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.firstname).to.equal(userData.firstname);
    });
  });

  describe("PATCH /users/update/:id", () => {
    it("should update an existing user if admin", async () => {
      const user = new User({
        name: "Bob",
        firstname: "Brown",
        email: "bob.brown@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      });
      await user.save();

      const updatedData = { name: "Bobby" };

      const res = await agent
        .patch(`/users/update/${user._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send(updatedData);

      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal(updatedData.name);
    });

    it("should return 404 if user not found", async () => {
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await agent
        .patch(`/users/update/${validObjectId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send({ name: "Nonexistent" });

      expect(res.status).to.equal(404);
      expect(res.body).to.equal("user not found");
    });
  });

  describe("PATCH /users/lessons/:lessonId/complete", () => {
    it("should mark a lesson as completed if admin", async () => {
      const user = new User({
        name: "Charlie",
        firstname: "Green",
        email: "charlie.green@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      });
      await user.save();

      const lessonId = "lessonId123";

      const res = await agent
        .patch(`/users/lessons/${lessonId}/complete`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Leçon complétée avec succès");
    });
  });

  describe("DELETE /users/delete/:id", () => {
    it("should delete a user if admin", async () => {
      const user = new User({
        name: "David",
        firstname: "Johnson",
        email: "david.johnson@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      });
      await user.save();

      const res = await agent
        .delete(`/users/delete/${user._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(204);
    });

    it("should return 403 if non-admin tries to delete user", async () => {
      const user = new User({
        name: "David",
        firstname: "Johnson",
        email: "david.johnson@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      });
      await user.save();

      const res = await agent
        .delete(`/users/delete/${user._id}`)
        .set("Authorization", `Bearer ${nonAdminToken}`)
        .set("X-XSRF-TOKEN", csrfToken);

      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal("Accès interdit. Vous devez être administrateur.");
    });
  });
});
