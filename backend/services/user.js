const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà enregistré." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isActive: false,
    });
    await newUser.save();

    // Générer un token de confirmation
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Expiration du token en 1 jour
    });

    // Envoyer un e-mail de confirmation
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true, // Pas de chiffrement nécessaire pour un serveur local
    });

    // Lien de confirmation avec query string
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmation de votre inscription",
      html: `<p>Merci de vous être inscrit. Cliquez sur le lien suivant pour confirmer votre compte :</p>
             <a href="${confirmationUrl}">Confirmer mon compte</a>`,
    });

    res.status(201).json({
      message:
        "Inscription réussie. Vérifiez votre e-mail pour confirmer votre compte.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

exports.confirmRegistration = async (req, res) => {
  try {
    // Récupérer le token depuis la query string
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Activer l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.isActive) {
      return res.status(400).json({ message: "Utilisateur déjà activé." });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      message:
        "Compte confirmé avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token invalide ou expiré." });
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Recherche de l'utilisateur
    let user = await User.findOne(
      { email: email },
      "-__v -createdAt -updatedAt"
    );

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Suppression du mot de passe de l'objet utilisateur
    const { _id, email: userEmail, role } = user; // Sélectionner les champs nécessaires
    const payload = { id: _id, email: userEmail, role: role };

    // Création du token JWT
    const expireIn = 24 * 60 * 60; // 24 heures
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: expireIn });

    // Envoi du token dans les headers
    res.header("Authorization", "Bearer " + token);

    // Réponse de succès
    return res
      .status(200)
      .json({ message: "Authenticate_succeed", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Obtenir tous les users
exports.getAll = async (req, res) => {
  try {
    const UserList = await User.find();
    return res.status(200).json(UserList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    let user = await User.findById(id);

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json("user not found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.add = async (req, res, next) => {
  const temp = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };

  try {
    let user = await User.create(temp);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const temp = {};
  if (req.body.name) temp.name = req.body.name;
  if (req.body.firstname) temp.firstname = req.body.firstname;
  if (req.body.email) temp.email = req.body.email;
  if (req.body.password) temp.password = req.body.password;
  if (req.body.lessons) temp.lessons = req.body.lessons;

  try {
    let user = await User.findOne({ _id: id });

    if (user) {
      Object.keys(temp).forEach((key) => {
        if (!!temp[key]) {
          user[key] = temp[key];
        }
      });

      await user.save();
      return res.status(201).json(user);
    }
    return res.status(404).json("user not found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });
    return res.status(204).json("user deleted");
  } catch (error) {
    return res.status(501).json(error);
  }
};
