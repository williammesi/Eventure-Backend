import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import argon from 'argon2';
import parseDuration from 'parse-duration';
import { Op } from 'sequelize';

import User from '../models/User.js';

class UserRepository {
    async login(credential, password) {
        const account = await this.retrieveByCredentials(credential);
        if (!account) {
            //Email ou Username non présent en base de données
            throw HttpErrors.Unauthorized();
        }

        if (!(await this.validatePassword(password, account))) {
            throw HttpErrors.Unauthorized();
        }

        return account;
    }

    async validatePassword(password, account) {
        //return await argon.verify(account.passwordHash, password);

        // temporaire juste le temps de voir si le mot de passe est bon
        return account.Password === password;
        
    }

    async create(account) {
        try {
            // Hasher le mot de passe
            const passwordHash = await argon.hash(account.password);
            
            const pascalAccount = {
                RoleID: account.roleID,
                Username: account.username,
                Password: passwordHash,
                Email: account.email,
                ProfilePictureHref: account.profilePictureHref,
                SecretQuestionID: account.secretQuestionID,
                SecretQuestionAnswer: account.secretQuestionAnswer,
                BannedUntil: account.bannedUntil || "1970-01-01"
            };

            return await User.create(pascalAccount);
        } catch (err) {
            throw err;
        }
    }


    async retrieveAll() {
    return User.findAll();
    }

    retrieveByCredentials(credential) {
        return User.findOne({ 
            where: {
                [Op.or]: [
                    { Email: credential }, 
                    { Username: credential }
                ] 
            }
        });
    }

    

    generateJWT(uuid) {
        const access = jwt.sign({ uuid: uuid }, 
            process.env.JWT_TOKEN_SECRET, 
            {
                expiresIn: process.env.JWT_TOKEN_LIFE,
                issuer: process.env.BASE_URL
            }
        );
        const refresh = jwt.sign({ uuid },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_LIFE,
                issuer: process.env.BASE_URL
            }
        );
        const expiresIn = parseDuration(process.env.JWT_TOKEN_LIFE);

        return { access, refresh, expiresIn };
    }

    async validateRefreshToken(email, headerBase64) {
        //TODO:
    }

    transform(account) {
        account.href = `${process.env.BASE_URL}/accounts/${account.uuid}`;

        delete account._id;
        delete account.__v;
        delete account.uuid;
        delete account.password;
        delete account.passwordHash;

        return account;
    }
}

export default new UserRepository();
