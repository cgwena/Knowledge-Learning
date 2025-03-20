import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà enregistré." });
    }

    let newUser = new User({
      name,
      email,
      password
    });
    newUser = await newUser.save();
    console.log('newUser', newUser);
  

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true,
    });

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


const confirmRegistration = async (req, res) => {
  try {
    // Get token from URL
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Activate user account
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

const authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Search for user in database
    let user = await User.findOne(
      { email: email },
      "-__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Delete password from user object
    const { _id, email: userEmail, role } = user; // Sélectionner les champs nécessaires
    const payload = { id: _id, email: userEmail, role: role };

    // Create token
    const expireIn = 24 * 60 * 60; // 24 heures
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expireIn });

    // Envoi du token dans les headers
    res.header("Authorization", "Bearer " + token);

    // Success response
    return res
      .status(200)
      .json({ message: "Authenticate_succeed", token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
const getAll = async (req, res) => {
  try {
    const UserList = await User.find();
    return res.status(200).json(UserList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res, next) => {
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

const add = async (req, res, next) => {
  if (!req.body) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const created_by = req.body.id;

  const temp = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    created_by : created_by,
  };

  try {
    let user = await User.create(temp);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(501).json(error);
  }
};

const update = async (req, res, next) => {
  const id = req.params.id;
  const temp = {};
  if (req.body.name) temp.name = req.body.name;
  if (req.body.firstname) temp.firstname = req.body.firstname;
  if (req.body.email) temp.email = req.body.email;
  if (req.body.password) temp.password = req.body.password;
  if (req.body.lessons) temp.lessons = req.body.lessons;
  if (req.body.cursus) temp.cursus = req.body.cursus;
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

const markLessonAsCompleted = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { lessonId } = req.params; // 🔹 Bien récupérer lessonId depuis params

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const cursusUpdated = user.completeLesson(lessonId);
    await user.save();

    return res.json({
      message: "Leçon complétée avec succès",
      cursusUpdated,
    });
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    await User.deleteOne({ _id: id });
    return res.status(204).json("user deleted");
  } catch (error) {
    return res.status(501).json(error);
  }
};

export default {
  registerUser,
  confirmRegistration,
  authenticate,
  getAll,
  getById,
  add,
  update,
  markLessonAsCompleted,
  delete: deleteUser,
};
