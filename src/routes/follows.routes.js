import express from "express";
import HttpErrors from "http-errors";

import validator from "../middlewares/validator.js";

import followRepository from "../repositories/follow.repository.js";

import { authenticateToken } from "../middlewares/authorization.jwt.js";
import eventsValidator from "../validators/events.validator.js";

const router = express.Router();

router.post("/:type/:id", create);

async function create(req, res, next) {
  try {
    if (req.query._body === "false") {
      return res.status(204).end();
    }

    const { type, id } = req.params;

    followRepository.create(type, id, req.body.userID);

    res.status(201);
  } catch (error) {
    return next(error);
  }
}

export default router;
