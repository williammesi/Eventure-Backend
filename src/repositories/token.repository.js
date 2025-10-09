import Token from '../models/Token.js';

class TokenRepository {
    findOne(token) {
        return Token.findOne({ where: { token } });
    }

    invalidate(token) {
        return Token.create({ token });
    }

    async isRevoked(token) {
        try {
            const tokenInDB = await Token.findOne({ where: { token: token } });

            if (!tokenInDB) {
                return false;
            }

            return true;

        } catch (err) {
            throw err;
        }
    }
}

export default new TokenRepository();