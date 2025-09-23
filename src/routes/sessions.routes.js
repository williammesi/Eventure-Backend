import express from 'express';
import HttpErrors from 'http-errors';

import accountRepository from '../repositories/account.repository.js';

import TokenController from '../controllers/token.controller.js';
const tokenController = new TokenController()

import { guardAuthorizationJWT, revokeAuthorization } from '../middlewares/authorization.jwt.js';

const router = express.Router();

router.post('/', login);
router.delete('/', logout);

async function login(req, res, next) {
    try {

        const {credential, password} = req.body;

        let account = await accountRepository.login(credential,password)

        // TODO : JWT Tokens
        const tokens = accountRepository.generateJWT(account.uuid);

        account = account.toObject({getters:false, virtuals: false});

        account = accountRepository.transform(account)

        

        


        res.status(201).json({account, tokens});
        
        
    } catch (error) {
        return next(error)
    }
}

async function logout(req, res, next) {
    try {
       //TODO:
    } catch(err) {
        return next(err);
    } 
}

export default router;