import express from 'express';
import HttpErrors from 'http-errors';
import { expressjwt } from 'express-jwt';

import userRepository from '../repositories/user.repository.js';

import TokenController from '../controllers/token.controller.js';
const tokenController = new TokenController();

import revokeAuthorization from '../middlewares/authorization.jwt.js';

const router = express.Router();

// Middleware spécial pour logout qui accepte les tokens expirés
const guardLogout = expressjwt({
    secret: process.env.JWT_TOKEN_SECRET,
    issuer: process.env.BASE_URL,
    algorithms: ['HS256'],
    ignoreExpiration: true // Permet les tokens expirés
});

router.post('/', login);
router.delete('/', guardLogout,revokeAuthorization, logout);

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
        await tokenController.invalidate(req.body.refreshToken);
        res.status(204).end();

    } catch (err) {
        return next(err);
    }
}

export default router;
