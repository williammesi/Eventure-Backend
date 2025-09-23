import express from 'express';
import HttpErrors from 'http-errors';

import { guardRefreshTokenJWT } from '../middlewares/authorization.jwt.js';

import accountRepository from '../repositories/account.repository.js';
import clientRepository from '../repositories/client.repository.js';

import TokenController from '../controllers/token.controller.js';
const tokenController = new TokenController()

const router = express.Router();

router.post('/', guardRefreshTokenJWT , refresh);

async function refresh(req, res, next) {

    try {
        const tokens = accountRepository.generateJWT(req.refresh.uuid)
        res.status(201).json(tokens);
    } catch (err) {
        return next(err);
    }
}

router.delete('/', (req, res, next) => {
    try {
        //TODO:
    } catch (err) {
        return next(err);
    }
});

export default router;
