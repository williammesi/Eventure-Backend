import express from "express";
import HttpErrors from "http-errors";

import validator from "../middlewares/validator.js";

import eventsRepository from "../repositories/event.repository.js";

import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.get("/", retrieveAll);
router.post("/events", create);

router.get("/:id", retrieveById);

async function retrieveAll(req, res, next) {
  try {
    let events = await eventsRepository.retrieveAll();
    events = events.map((e) => {
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
    const event = await eventsRepository.findById(id);
    if (!event) {
      throw HttpErrors.NotFound();
    }
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    let newEvent = await eventsRepository.create(req.body);

    if (req.query._body === "false") {
      return res.status(204).end();
    }

    res.status(201).json(newEvent);
  } catch (err) {
    return next(err);
  }
}

export default router;
