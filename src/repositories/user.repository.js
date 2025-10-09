import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import argon from 'argon2';
import parseDuration from 'parse-duration';
import { Op } from 'sequelize';

import User from '../models/User.js';
import Organisation from '../models/Organisation.js';

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
        return await argon.verify(account.Password, password);
    }

    async create(account) {
    try {
        console.log("Payload reçu dans repository:", account);

        const passwordHash = await argon.hash(account.Password);

        account.Password = passwordHash;

        console.log("Objet envoyé à Sequelize:", account);

        return await User.create(account);
    } catch (err) {
        throw err;
    }
}

    async retrieveById(id) {
        return User.findByPk(id);
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

   async retrieveAnOrganisationById(userId) {
        return await Organisation.findOne({
            where: { UserID: userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['ID', 'Username', 'Email', 'ProfilePictureHref']
            }]
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
