import express from 'express';
import HttpErrors from 'http-errors';

import userRepository from '../repositories/user.repository.js';

import TokenController from '../controllers/token.controller.js';
const tokenController = new TokenController();

import { guardAuthorizationJWT, revokeAuthorization } from '../middlewares/authorization.jwt.js';

const router = express.Router();

router.post('/', login);
router.delete('/', guardAuthorizationJWT, logout);

async function login(req, res, next) {
    try {
        const { credential, password } = req.body;

        let account = await userRepository.login(credential, password);
        if (!account) {
            throw new HttpErrors.Unauthorized('Identifiants invalides');
        }

        const tokens = userRepository.generateJWT(account._id);


        account = account.toJSON();
        account = userRepository.transform(account);

        res.status(201).json({ account, tokens });
    } catch (err) {
        return next(err);
    }
}

async function logout(req, res, next) {
    try {
        // Révoque l'autorisation JWT (supprime le token côté serveur)
        await revokeAuthorization(req);
        
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (err) {
        return next(err);
    }
}

export default router;
