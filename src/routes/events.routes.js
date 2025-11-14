import express from "express";
import HttpErrors from "http-errors";

import validator from "../middlewares/validator.js";

import eventsRepository from "../repositories/event.repository.js";
import certificationsRepository from "../repositories/certifications.repository.js";

import { authenticateToken } from "../middlewares/authorization.jwt.js";
import eventsValidator from "../validators/events.validator.js";

const router = express.Router();

router.get("/", retrieveAll);
router.post("/", eventsValidator.postValidator(), create);

router.delete("/:id", authenticateToken, deleteById);
router.get("/:id", retrieveById);

router.put("/:id", async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log("Route PUT /events/:id appelée");
    console.log("eventId:", eventId);
    console.log("req.body:", req.body);

    const updatedEvent = await eventsRepository.updateEvent(eventId, req.body);
    return res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Erreur dans la route PUT /events/:id:", err);

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

async function retrieveAll(req, res, next) {
  try {
    let events = await eventsRepository.retrieveAll();
    events = await Promise.all(
      events.map(async (e) => {
        e = e.toJSON();
        e = await eventsRepository.transform(e);
        return e;
      })
    );

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
    if (req.query._body === "false") {
      return res.status(204).end();
    }

    const newEvent = await eventsRepository.create(req.body);

    res.status(201).json(newEvent);
  } catch (err) {
    return next(err);
  }
}

async function deleteById(req, res, next) {
  try {
    const id = req.params.id;
    const userId = parseInt(req.auth.userId);
    const userRoleId = parseInt(req.auth.roleId);

    const event = await eventsRepository.findById(id);

    if (!event) {
      throw HttpErrors.NotFound("Événement non trouvé");
    }

    const isModerator = userRoleId === 3;
    const isOrganizer = event.UserID === userId;

    if (!isModerator && !isOrganizer) {
      throw HttpErrors.Forbidden(
        "Vous n'êtes pas autorisé à supprimer cet événement"
      );
    }

    await certificationsRepository.deleteByEventId(id);
    await eventsRepository.delete(id);
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

export default router;
