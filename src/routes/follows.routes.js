import express from "express";
import HttpErrors from "http-errors";

import validator from "../middlewares/validator.js";

import followRepository from "../repositories/follow.repository.js";

import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.post("/:type/:id", guardAuthorizationJWT, create);
router.delete("/:type/:id", guardAuthorizationJWT, remove);
router.get("/", guardAuthorizationJWT, fetchByUserID);

async function fetchByUserID(req, res, next) {
  try {
    const userID = req.auth.userId;

    const follows = await followRepository.retrieveByUserID(userID);

    res.status(200).json(follows);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const type = req.params.type;
    const id = req.params.id;

    await followRepository.create(type, id, req.auth.userId);

    res.status(201).end();
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const type = req.params.type;
    const id = req.params.id;

    await followRepository.delete(type, id, req.auth.userId);

    res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

export default router;
