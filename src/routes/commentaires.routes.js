import express from "express";
import HttpErrors from "http-errors";
import commentaireRepository from "../repositories/commentaire.repository.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";
import { authenticateToken } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.get("/:eventId", retrieveAllForEvent);
router.post("/", guardAuthorizationJWT, createCommentaire);
router.delete("/:commentaireId", guardAuthorizationJWT, deleteCommentaire);
router.get("/findOne/:commentaireId", retrieveOne);

async function createCommentaire(req, res, next) {
  try {

    var userId = req.auth.userId;
    
    const newCommentaire = await commentaireRepository.create(req.body, userId);
    res.status(201).json(newCommentaire);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function retrieveAllForEvent(req, res, next) {
  try {
    let commentaires = await commentaireRepository.retrieveAllForEvent(req.params.eventId);
    commentaires.map((c) => {
      c = c.toJSON();

      return c;
    });

    res.status(200).json(commentaires);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function retrieveOne(req, res, next) {
  try {
    const commentaireId = req.params.commentaireId;
    const commentaire = await commentaireRepository.findById(commentaireId);
    if (!commentaire) {
      throw HttpErrors.NotFound("Commentaire non trouvé");
    }
    res.status(200).json(commentaire);
  } catch (err) {
    return next(err);
  }
}

async function deleteCommentaire(req, res, next) {
  try {
    const commentaireId = req.params.commentaireId;
    const userId = parseInt(req.auth.userId);
    const userRoleId = parseInt(req.auth.roleId);

    const commentaire = await commentaireRepository.findById(commentaireId);

    if (!commentaire) {
      throw HttpErrors.NotFound("Commentaire non trouvé");
    }

    const isModerator = userRoleId === 3;
    const isOwner = commentaire.UserID === userId;

    if (!isModerator && !isOwner) {
      throw HttpErrors.Forbidden(
        "Vous n'êtes pas autorisé à supprimer ce commentaire"
      );
    }

    await commentaireRepository.delete(commentaireId);
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

export default router;
