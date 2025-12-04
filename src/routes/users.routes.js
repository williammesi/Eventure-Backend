import express from "express";
import jwt from "jsonwebtoken";
import HttpErrors from "http-errors";

import validator from "./../middlewares/validator.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

import userRepository from "../repositories/user.repository.js";
import securityQuestionsRepository from "../repositories/securityQuestions.repository.js";
import usersValidators from "../validators/users.validator.js";

const router = express.Router();

//router.get('/', retrieveAll);
router.post("/", usersValidators.postValidator(), validator, post);
router.post("/reset-password", resetPassword);
router.get("/search", guardAuthorizationJWT, search);
router.patch("/:id/ban", guardAuthorizationJWT, usersValidators.banValidator(), validator, banUser);
router.delete("/:id/ban", guardAuthorizationJWT, unbanUser);
router.get("/:id", retrieveById);
router.get("/:id/security-questions", retrieveSecurityQuestionsByCredentials);

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

async function retrieveSecurityQuestionsByCredentials(req, res, next) {
  try {
    const username = req.query.username || null;
    const email = req.query.email || null;

    if (!username || !email) {
      throw HttpErrors.BadRequest(
        "Le nom d'utilisateur et l'email doit être fourni"
      );
    }

    const securityQuestion =
      await securityQuestionsRepository.findByUserCredentials(username, email);

    if (!securityQuestion) {
      throw HttpErrors.NotFound("Aucun compte trouvé avec ces identifiants");
    }

    res.status(200).json(securityQuestion);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { resetToken, newPassword } = req.body;

    // Validate input
    if (!resetToken || !newPassword) {
      throw HttpErrors.BadRequest(
        "Le token de réinitialisation et le nouveau mot de passe sont requis"
      );
    }

    // Validate password strength (at least 6 characters)
    if (newPassword.length < 6) {
      throw HttpErrors.BadRequest(
        "Le mot de passe doit contenir au moins 6 caractères"
      );
    }

    // Verify and decode reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_TOKEN_SECRET, {
        issuer: process.env.BASE_URL,
        algorithms: ["HS256"],
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw HttpErrors.Unauthorized("Le token de réinitialisation a expiré");
      }
      throw HttpErrors.Unauthorized("Token de réinitialisation invalide");
    }

    // Validate token purpose
    if (decoded.purpose !== "password-reset") {
      throw HttpErrors.Unauthorized(
        "Token invalide pour la réinitialisation de mot de passe"
      );
    }

    // Update user password
    const user = await userRepository.updatePassword(
      decoded.userId,
      newPassword
    );

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
      username: user.Username,
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return next(err);
  }
}

async function search(req, res, next) {
  try {
    const userRoleId = parseInt(req.auth.roleId);

    // Only moderators (RoleID 3) can search users
    if (userRoleId !== 3) {
      throw HttpErrors.Forbidden(
        "Vous n'êtes pas autorisé à effectuer cette recherche"
      );
    }

    const query = req.query.q;

    if (!query) {
      throw HttpErrors.BadRequest("Query parameter 'q' is required");
    }

    // search() already returns transformed users
    const users = await userRepository.search(query);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error in search:", err);
    return next(err);
  }
}

router.put("/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    console.log("Route PUT /:id appelée");
    console.log("userId:", userId);
    console.log("req.body:", req.body);

    const updatedUser = await userRepository.updateOrganisation(
      userId,
      req.body
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Erreur dans la route PUT /users/:id:", err);

    if (err.status === 404) {
      return res.status(404).json({ message: err.message });
    }
    if (err.status === 403) {
      return res.status(403).json({ message: err.message });
    }
    if (err.status === 409) {
      return res.status(409).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Erreur serveur" });
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
    user = await userRepository.transform(user);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function banUser(req, res, next) {
  try {
    const userRoleId = parseInt(req.auth.roleId);

    // Only moderators (RoleID 3) can ban users
    if (userRoleId !== 3) {
      throw HttpErrors.Forbidden("Vous n'êtes pas autorisé à bannir des utilisateurs");
    }

    const userId = parseInt(req.params.id);
    const { bannedUntil } = req.body;

    // Check if the target user is a moderator
    const targetUser = await userRepository.retrieveById(userId);
    if (!targetUser) {
      throw HttpErrors.NotFound("Utilisateur non trouvé");
    }

    if (targetUser.RoleID === 3) {
      throw HttpErrors.Forbidden("Vous ne pouvez pas bannir un modérateur");
    }

    let user = await userRepository.banUser(userId, bannedUntil);
    user = user.toJSON();
    user = await userRepository.transform(user);

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in banUser:", err);
    return next(err);
  }
}

async function unbanUser(req, res, next) {
  try {
    const userRoleId = parseInt(req.auth.roleId);

    // Only moderators (RoleID 3) can unban users
    if (userRoleId !== 3) {
      throw HttpErrors.Forbidden("Vous n'êtes pas autorisé à débannir des utilisateurs");
    }

    const userId = parseInt(req.params.id);

    let user = await userRepository.unbanUser(userId);
    user = user.toJSON();
    user = await userRepository.transform(user);

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in unbanUser:", err);
    return next(err);
  }
}

export default router;
