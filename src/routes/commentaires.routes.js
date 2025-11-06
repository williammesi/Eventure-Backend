import express from "express";
import commentaireRepository from "../repositories/commentaire.repository.js";

const router = express.Router();

router.get("/:eventId", retrieveAllForEvent);

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
