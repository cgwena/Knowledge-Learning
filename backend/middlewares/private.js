const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Vérification du format "Bearer"
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length); // Retire le "Bearer " du token
    }

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    // Vérification et décodage du token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message:
            err.name === "TokenExpiredError"
              ? "Token expired"
              : "Invalid token",
        });
      }

      // Log de débogage : vérifiez ce que contient le "decoded"
      if (decoded) {
        req.decoded = decoded;
    
        const expireIn = 24 * 60 * 60; // 24 heures
        const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, {
          expiresIn: expireIn,
        });
        res.setHeader("Authorization", "Bearer " + newToken);

        return next();
      } else {
        return res.status(401).json({ message: "Invalid token data" });
      }
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkAdmin = (req, res, next) => {
  // Vérifie si l'utilisateur a un rôle 'admin' dans le token décodé
  console.log("Utilisateur connecté :", req.decoded);
  if (req.decoded && req.decoded.role === "admin") {
    return next(); // Si l'utilisateur est un admin, passe à la route suivante
  } else {
    return res
      .status(403)
      .json({ message: "Accès interdit. Vous devez être administrateur." });
  }
};
