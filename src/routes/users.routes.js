import express from "express";
import HttpErrors from "http-errors";

import validator from "./../middlewares/validator.js";

import userRepository from "../repositories/user.repository.js";
import usersValidators from "../validators/users.validator.js";

const router = express.Router();

//router.get('/', retrieveAll);
router.post("/", usersValidators.postValidator(), validator, post);
router.get("/:id", retrieveById);
//router.put("/:id", usersValidators.updateOrganisationValidator(), validator);

async function post(req, res, next) {
  try {
    console.log("Body reçu dans le controller:", req.body);

    let user = await userRepository.create(req.body);
    const tokens = userRepository.generateJWT(user.uuid);

    user = user.toJSON();
    user = userRepository.transform(user);

    res.status(201).json({ user, tokens });
  } catch (err) {
    return next(err);
  }
}


router.put('/:id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    console.log('Route PUT /:id appelée');
    console.log('userId:', userId);
    console.log('req.body:', req.body);
    
    const updatedUser = await userRepository.updateOrganisation(userId, req.body);
    
    return res.status(200).json(updatedUser);
    
  } catch (err) {
    console.error('Erreur dans la route PUT /users/:id:', err);
    
    if (err.status === 404) {
      return res.status(404).json({ message: err.message });
    }
    if (err.status === 403) {
      return res.status(403).json({ message: err.message });
    }
    if (err.status === 409) {
      return res.status(409).json({ message: err.message });
    }
    
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
});

// async function retrieveAll(req, res, next) {
//     try {
//         let users = await userRepository.retrieveAll();
//         users = users.map(u => {
//             u = u.toJSON();
//             // TODO: u = usersRepository.transform(u, req.options);
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
    user = await userRepository.transform(user);
    res.status(200).json(user);
    
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

export default router;
