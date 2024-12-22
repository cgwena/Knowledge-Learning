const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = (req, res, next) => {
    try {
      let token = req.headers['x-access-token'] || req.headers['authorization'];
  
      // Vérification du format "Bearer"
      if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Retire le "Bearer " du token
      }
  
      if (!token) {
        return res.status(401).json({ message: 'Token required' });
      }
  
      // Vérification et décodage du token
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: err.name === 'TokenExpiredError'
              ? 'Token expired'
              : 'Invalid token',
          });
        }
  
        // Log de débogage : vérifiez ce que contient le "decoded"
        console.log("Decoded token:", decoded);
  
        if (decoded) {
          req.decoded = decoded;
          // Si le decoded contient des informations sur l'utilisateur, vérifiez ici
          console.log("Decoded user:", decoded); // Assurez-vous que `decoded.user` existe
  
          // Si le token est valide, ajoutez un nouveau token avec une nouvelle expiration
          const expireIn = 24 * 60 * 60; // 24 heures
          const newToken = jwt.sign(
            { user: decoded.user },
            SECRET_KEY,
            { expiresIn: expireIn }
          );
          res.setHeader('Authorization', 'Bearer ' + newToken);
  
          return next();
        } else {
          return res.status(401).json({ message: 'Invalid token data' });
        }
      });
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };