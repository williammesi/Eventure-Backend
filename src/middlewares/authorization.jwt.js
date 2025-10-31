import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import tokenRepository from '../repositories/token.repository.js';

const guardAuthorizationJWT = expressjwt({
    secret: process.env.JWT_TOKEN_SECRET,
    issuer: process.env.BASE_URL,
    algorithms: ['HS256']
});

const guardRefreshTokenJWT = expressjwt({
    secret : process.env.JWT_REFRESH_SECRET,
    issuer : process.env.BASE_URL,
    algorithms: ['HS256'],
    requestProperty: 'refresh',
    getToken: (req) => {
        return req.body.refreshToken
    }
});

// Nouveau middleware personnalisé pour l'authentification
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                userMessage: 'Token manquant',
                status: 401 
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET, {
            issuer: process.env.BASE_URL,
            algorithms: ['HS256']
        });
        
        console.log('Token décodé:', decoded); // Pour déboguer
        
        // Adaptez selon les champs de votre token JWT
        req.auth = {
            userId: decoded.userId || decoded.id || decoded.ID,
            roleId: decoded.roleId || decoded.RoleID,
            email: decoded.email
        };
        
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(403).json({ 
            userMessage: 'Token invalide ou expiré',
            status: 403 
        });
    }
};

const revokeAuthorization = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        await tokenRepository.invalidate(token);
    }
};

const checkTokenBlacklist = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token && await tokenRepository.isRevoked(token)) {
        return res.status(401).json({ message: 'Token révoqué' });
    }
    
    next();
};

export { guardAuthorizationJWT, guardRefreshTokenJWT, authenticateToken, revokeAuthorization, checkTokenBlacklist };