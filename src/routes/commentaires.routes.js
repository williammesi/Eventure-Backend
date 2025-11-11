import express from "express";
import commentaireRepository from "../repositories/commentaire.repository.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.get("/:eventId", retrieveAllForEvent);
router.post("/", guardAuthorizationJWT, createCommentaire);

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

export default router;
