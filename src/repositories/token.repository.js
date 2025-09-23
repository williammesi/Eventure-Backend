import { RevokedToken } from '../models/token.model.js';

class TokenRepository {
    findOne(token) {
        return RevokedToken.findOne({ token });
    }

    invalidate(token) {
        return RevokedToken.create({ token });
    }

    async isRevoked(token) {
        //TODO:
    }
}

export default new TokenRepository();
