import { describe, it } from "mocha";
import sinon from "sinon";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js"; // Ajuste le chemin vers ton fichier app.js
import mongoose from "mongoose";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

describe("User Registration", () => {
  let saveStub, findOneStub, transporterStub, sendMailStub;

  beforeEach(() => {
    // Simuler User.findOne pour éviter des appels à la base de données
    findOneStub = sinon.stub(User, "findOne").resolves(null); // Aucun utilisateur existant

    // Simuler User.save pour éviter de réellement sauvegarder en base de données
    saveStub = sinon.stub(User.prototype, "save").resolves();

    // Simuler sendMail
    sendMailStub = sinon.stub().resolves();

    // Simuler l'envoi d'e-mails avec nodemailer
    transporterStub = sinon.stub(nodemailer, "createTransport").returns({
      sendMail: sendMailStub,
    });
  });

  afterEach(async() => {
    sinon.restore(); // Restaurer les stubs après chaque test
  });

  it("should register a new user and send a confirmation email", (done) => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    };

    request(app)
      .post("/user/register")
      .send(userData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal(
          "Inscription réussie. Vérifiez votre e-mail pour confirmer votre compte."
        );

        // Vérifier que la méthode save a été appelée
        sinon.assert.calledOnce(saveStub);

        // Vérifier que l'email a été envoyé
        sinon.assert.calledOnce(sendMailStub);

        // Vérifier que le contenu de l'email contient le bon lien de confirmation
        sinon.assert.calledWith(
          sendMailStub,
          sinon.match({
            from: "knowledgelearning72@gmail.com",
            to: "testuser@example.com",
            subject: "Confirmation de votre inscription",
            html: sinon.match(/http:\/\/localhost:8080\/confirm\?token=\S+/), // Vérification plus souple
          })
        );

        done();
      });
  });

  it("should return 400 if email already exists", (done) => {
    // Simuler un utilisateur déjà existant
    findOneStub.resolves({ email: "testuser@example.com" });

    request(app)
      .post("/user/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Email déjà enregistré.");

        done();
      });
  });
});

describe("User Authentication", () => {
  let findOneStub, compareStub;

  beforeEach(() => {
    // Simuler User.findOne pour récupérer un utilisateur
    findOneStub = sinon.stub(User, "findOne").returns({
      _id: "user_id",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword123", // Le mot de passe hashé
      role: "user",
      isActive: true,
    });

    // Simuler bcrypt.compare pour valider le mot de passe
    compareStub = sinon.stub(bcrypt, "compare").resolves(true); // Simuler un mot de passe valide
  });

  afterEach(() => {
    sinon.restore(); // Restaurer les stubs après chaque test
  });

  it("should authenticate the user and return a token", (done) => {
    request(app)
      .post("/user/authenticate")
      .send({
        email: "testuser@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Authenticate_succeed");
        expect(res.body).to.have.property("token");

        done(); // Indiquer que le test est terminé
      });
  });

  it("should return 403 if password is invalid", (done) => {
    // Modifier le stub pour simuler un mot de passe invalide
    compareStub.resolves(false);

    request(app)
      .post("/user/authenticate")
      .send({
        email: "testuser@example.com",
        password: "wrongpassword",
      })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("Invalid credentials");

        done(); // Indiquer que le test est terminé
      });
  });

  it("should return 404 if user not found", (done) => {
    // Modifier le stub pour simuler un utilisateur introuvable
    findOneStub.returns(null);

    request(app)
      .post("/user/authenticate")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("User not found");

        done(); // Indiquer que le test est terminé
      });
  });
});

describe("User Services", () => {
  // Se connecter à la base de données avant chaque test
  before(async () => {
    await mongoose.connect(process.env.URL_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Se déconnecter de la base de données après chaque test
  after(async () => {
    await User.deleteMany({  email: /@example\.com$/  });
    await mongoose.disconnect();
  });

  // Test : Obtenir tous les utilisateurs
  describe("GET /user", function () {
    // Définir le timeout à 10000ms pour ce test
    this.timeout(10000);

    let compareStub;

    beforeEach(() => {
      // Stub pour bcrypt.compare afin de simuler la comparaison du mot de passe
      compareStub = sinon.stub(bcrypt, "compare").resolves(true); // Simuler un mot de passe valide
    });

    afterEach(() => {
      sinon.restore(); // Restaurer tous les stubs après chaque test
    });

    it("should return all users", async () => {
      // 1️⃣ Création d'un utilisateur test avec mot de passe haché
      // Hachage du mot de passe
      const user = new User({
        name: "John",
        firstname: "Doe",
        email: "john.doe@example.com",
        password: "password123", // Mot de passe haché
        role: "admin",
        isActive: true,
      });
      await user.save();

      // 2️⃣ Connexion de l'utilisateur pour récupérer un token
      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token; // Vérifie que la réponse contient bien "token"
      // 3️⃣ Utilisation du token pour faire la requête GET /users
      const res = await request(app)
        .get("/user")
        .set("Authorization", `Bearer ${token}`); // Ajout du token dans l'en-tête

      // 4️⃣ Vérification des résultats
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.length.greaterThan(0);
    });
  });

  // Test : Obtenir un utilisateur par ID
  describe("GET /users/:id", () => {
    it("should return a user by ID", async () => {
      const user = new User({
        name: "Jane",
        firstname: "Doe",
        email: "jane.doe@example.com",
        password: "password123",
        role: "admin",
      });
      await user.save();

      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const res = await request(app)
        .get(`/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.include({ name: "Jane", firstname: "Doe" });
    });

    it("should return 404 if user not found", async () => {
      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      
      const validObjectId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/users/${validObjectId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.equal("user not found");
    });
  });

  // Test : Ajouter un utilisateur
  describe("POST /users/add", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "Alice",
        firstname: "Smith",
        email: "alice.smith@example.com",
        password: "password123",
        role: "user",
      };

      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const res = await request(app)
        .post("/users/add")
        .set("Authorization", `Bearer ${token}`)
        .send(userData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.firstname).to.equal(userData.firstname);
    });
  });

  // Test : Mettre à jour un utilisateur
  describe("PATCH /users/update/:id", () => {
    it("should update an existing user", async () => {
      const user = new User({
        name: "Bob",
        firstname: "Brown",
        email: "bob.brown@example.com",
        password: "password123",
        role: "user",
      });
      await user.save();

      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const updatedData = { "name": "Bobby" };

      const res = await request(app)
        .patch(`/users/update/${user._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData);
      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal(updatedData.name);
    });

    it("should return 404 if user not found", async () => {
      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const validObjectId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .patch(`/users/update/${validObjectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ "name": "Nonexistent" });
      expect(res.status).to.equal(404);
      expect(res.body).to.equal("user not found");
    });
  });

  // Test : Marquer une leçon comme complétée
  describe("PATCH /users/lessons/:lessonId/complete", () => {
    it("should mark a lesson as completed", async () => {
      const user = new User({
        name: "Charlie",
        firstname: "Green",
        email: "charlie.green@example.com",
        password: "password123",
        role: "user",
      });
      await user.save();

      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const lessonId = "lessonId123"; // Remplacer par un ID valide

      const res = await request(app)
        .patch(`/users/lessons/${lessonId}/complete`)
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Leçon complétée avec succès");
    });
  });

  // Test : Supprimer un utilisateur
  describe("DELETE /users/delete/:id", () => {
    it("should delete a user", async () => {
      const user = new User({
        name: "David",
        firstname: "Johnson",
        email: "david.johnson@example.com",
        password: "password123",
        role: "user",
      });
      await user.save();

      const loginRes = await request(app)
        .post("/user/authenticate") // Remplace "/login" par ton endpoint réel
        .send({
          email: "john.doe@example.com",
          password: "password123",
        });

      expect(loginRes.status).to.equal(200);
      const token = loginRes.body.token;

      const res = await request(app)
        .delete(`/users/delete/${user._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(204);
    });
  });
});
