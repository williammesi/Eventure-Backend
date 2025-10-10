
import HttpErrors from 'http-errors';
import tokenRepository from '../repositories/token.repository.js';

export default class TokenController {
    async isRevoked(token) {
        return await tokenRepository.isRevoked(token);
    }

    async invalidate(token) {
        try {
           const revokedToken = await tokenRepository.invalidate(token);
           if(!revokedToken) {
            throw HttpErrors.Unauthorized();
           }
           return revokedToken;
        } catch (err) {
            throw err;
        }
    }
}
