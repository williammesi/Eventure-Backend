import express from 'express';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import validator from '../middlewares/validator.js';

import securityQuestionsRepository from '../repositories/securityQuestions.repository.js';
import userRepository from '../repositories/user.repository.js';

import { guardAuthorizationJWT } from '../middlewares/authorization.jwt.js';


const router = express.Router();

router.get('/', retrieveAll);


router.get('/:id', retrieveById);


router.post('/', validateSecurityAnswer)



async function validateSecurityAnswer(req, res, next) {
    try {
        const { username, email, answer } = req.body;

        // Validate input
        if (!username || !email || !answer) {
            throw HttpErrors.BadRequest("Le nom d'utilisateur, l'email et la réponse doivent être fournis");
        }

        // Find security question by user credentials (with answer for validation)
        const securityQuestion = await securityQuestionsRepository.findByUserCredentials(username, email, true);

        if (!securityQuestion) {
            throw HttpErrors.NotFound("Aucun compte trouvé avec ces identifiants");
        }

        // Validate answer (case-insensitive comparison)
        if (securityQuestion.Answer.toLowerCase().trim() !== answer.toLowerCase().trim()) {
            throw HttpErrors.Unauthorized("Réponse incorrecte à la question de sécurité");
        }

        // Get user to include username in token
        const user = await userRepository.retrieveByUsernameEmail(username, email);
        if (!user) {
            throw HttpErrors.NotFound("Utilisateur non trouvé");
        }

        // Generate temporary reset token (short-lived, for password reset flow only)
        const resetToken = jwt.sign(
            {
                userId: user.ID,
                username: user.Username,
                email: user.Email,
                purpose: 'password-reset' // Mark this as a reset token
            },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn: '15m', // Short expiration for security
                issuer: process.env.BASE_URL
            }
        );

        res.status(200).json({
            message: "Réponse correcte",
            resetToken: resetToken
        });

    } catch (err) {
        console.error("Error in validateSecurityAnswer:", err);
        return next(err);
    }
}

async function retrieveAll(req, res, next) {
    try {
        let events = await securityQuestionsRepository.retrieveAll();
        events = events.map(e => {
            e = e.toJSON();

            // TODO: e = eventsRepository.transform(e, req.options);
            return e;
        });

        res.status(200).json(events);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

async function retrieveById(req, res, next) {
    try {
        const id = req.params.id;
        const event = await securityQuestionsRepository.findById(id);
        if (!event) {
            throw HttpErrors.NotFound();
        }
        res.status(200).json(event);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}
    
export default router;
