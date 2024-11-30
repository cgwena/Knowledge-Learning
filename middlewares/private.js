const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = (req, res, next) => {
    try {
        // Récupération du token depuis les en-têtes
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        // Vérification du format "Bearer"
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (!token) {
            return res.status(401).json({ message: 'Token required' });
        }

        // Vérification du token
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: err.name === 'TokenExpiredError' 
                        ? 'Token expired' 
                        : 'Invalid token',
                });
            }
        
            req.decoded = decoded;
        
            // Vérifiez les données utilisateur
            console.log("Decoded user:", decoded.user);
        
            // Utilisez des données uniques pour chaque utilisateur
            const expireIn = 24 * 60 * 60; // 24 heures
            const newToken = jwt.sign(
                {
                    user: decoded.user,
                },
                SECRET_KEY,
                { expiresIn: expireIn }
            );
        
            // Ajoutez le nouveau token dans l'en-tête
            res.setHeader('Authorization', 'Bearer ' + newToken);
        
            next();
        });
        
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
