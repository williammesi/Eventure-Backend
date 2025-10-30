import express from 'express';
import HttpErrors from 'http-errors';
import { expressjwt } from 'express-jwt';

import userRepository from '../repositories/user.repository.js';
import tokenRepository from '../repositories/token.repository.js';

import TokenController from '../controllers/token.controller.js';
const tokenController = new TokenController();

const router = express.Router();

// Middleware spécial pour logout qui accepte les tokens expirés
const guardLogout = expressjwt({
    secret: process.env.JWT_TOKEN_SECRET,
    issuer: process.env.BASE_URL,
    algorithms: ['HS256'],
    ignoreExpiration: true // Permet les tokens expirés
});

router.post('/', login);
router.delete('/', guardLogout, logout);

async function login(req, res, next) {
    try {
        const { credential, password } = req.body;

        let user = await userRepository.login(credential, password);
        if (!user) {
            throw new HttpErrors.Unauthorized('Identifiants invalides');
        }

        const tokens = userRepository.generateJWT(user._id);


        user = user.toJSON();
        user = userRepository.transform(user);

        res.status(201).json({ user, tokens });
    } catch (err) {
        return next(err);
    }
}

async function logout(req, res, next) {
    try {
        // Extraire le token depuis l'header Authorization
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Ajouter le token à la blacklist en BD
            await tokenRepository.invalidate(token);
        }
        
        res.status(200).json({ message: 'Déconnexion réussie - Token révoqué' });
    } catch (err) {
        return next(err);
    }
}

export default router;
