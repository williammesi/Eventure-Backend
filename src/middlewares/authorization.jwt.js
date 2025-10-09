import { expressjwt } from 'express-jwt';
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

export { guardAuthorizationJWT, guardRefreshTokenJWT, revokeAuthorization, checkTokenBlacklist };
