const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

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
    const payload = { id: _id, email: userEmail, role };

    // Création du token JWT
    const expireIn = 24 * 60 * 60; // 24 heures
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: expireIn });

    // Envoi du token dans les headers
    res.header("Authorization", "Bearer " + token);

    // Réponse de succès
    return res.status(200).json({ message: "Authenticate_succeed", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Obtenir toutes les leçons
exports.getAll = async (req, res) => {
  try {
    const UserList = await User.find()
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
  const temp = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  };

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
