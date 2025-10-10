import express from "express";
import HttpErrors from "http-errors";
import locationRepository from "../repositories/location.repository.js";

const router = express.Router();

router.post("/", create);
router.get("/:id", retrieveById);
router.put("/:id", update);
router.delete("/:id", remove);

async function create(req, res, next) {
  try {
    let newLocation = await locationRepository.create(req.body);

    if (req.query._body === "false") {
      return res.status(204).end();
    }

    res.status(201).json(newLocation);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function retrieveById(req, res, next) {
  try {
    const id = req.params.id;
    const location = await locationRepository.findById(id);
    if (!location) {
      throw HttpErrors.NotFound();
    }
    res.status(200).json(location);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const updated = await locationRepository.update(id, req.body);
    if (!updated) {
      throw HttpErrors.NotFound();
    }
    res.status(200).json({ message: "Location updated successfully" });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await locationRepository.delete(id);
    if (!deleted) {
      throw HttpErrors.NotFound();
    }
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

export default router;
