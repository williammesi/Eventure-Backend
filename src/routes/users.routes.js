import express from 'express';
import HttpErrors from 'http-errors';

import userRepository from '../repositories/user.repository.js';

const router = express.Router();

router.get('/', retrieveAll);

async function retrieveAll(req, res, next) {
    try {
        let users = await userRepository.retrieveAll();
        users = users.map(u => {
            u = u.toJSON();
            // TODO: u = usersRepository.transform(u, req.options);
            return u;
        });

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

router.post('/validate', async (req, res, next) => {
    try {
        const { credential, password } = req.body;
        const user = await userRepository.login(credential, password);
        res.status(200).json({ valid: true, user: userRepository.transform(user.toJSON()) });
    } catch (err) {
        // Si login échoue, on retourne valid: false
        res.status(401).json({ valid: false, message: 'Identifiants invalides' });
    }
});

export default router;