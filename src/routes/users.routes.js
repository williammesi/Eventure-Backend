import express from 'express';
import HttpErrors from 'http-errors';

import validator from './../middlewares/validator.js';

import userRepository from '../repositories/user.repository.js';
import usersValidators from '../validators/users.validator.js';


const router = express.Router();

//router.get('/', retrieveAll);
router.post('/', usersValidators.postValidator(), validator, post);
router.get('/:id', retrieveById);
router.get('/organisation/:id', retrieveAnOrganisationById);


async function post(req, res, next) {
    try {
        console.log("Body reçu dans le controller:", req.body);

        let user= await userRepository.create(req.body);


        // TODO : Créer un client ou un organisateur selon le RoleID
        // if (user.roleID === 1) {
            
        //     clientRepository.create({ UserID: user.id });
        // }
        // else if (user.roleID === 2) {
        //     organizerRepository.create({ UserID: user.id });
        // }

        

        const tokens = userRepository.generateJWT(user.uuid);

        user = user.toJSON();
        user = userRepository.transform(user);


        res.status(201).json({ user, tokens });
    } catch (err) {
        return next(err);
    }
}




// async function retrieveAll(req, res, next) {
//     try {
//         let users = await userRepository.retrieveAll();
//         users = users.map(u => {
//             u = u.toJSON();
//             TODO: u = usersRepository.transform(u, req.options);
//             return u;
//         });

//         res.status(200).json(users);
//     } catch (err) {
//         console.log(err);
//         return next(err);
//     }
// }

async function retrieveById(req, res, next) {
    try {
        const id = req.params.id;
        let user = await userRepository.retrieveById(id);
        if (!user) {
            throw HttpErrors.NotFound();
        }
        user = user.toJSON();
        // TODO: user = usersRepository.transform(user, req.options);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

async function retrieveAnOrganisationById(req, res, next) {
    try {
        const id = req.params.id;
        let organisation = await userRepository.retrieveAnOrganisationById(id);
        if (!organisation) {
            throw HttpErrors.NotFound();
        }
        organisation = organisation.toJSON();
        res.status(200).json(organisation);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

export default router;