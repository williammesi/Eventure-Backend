import express from "express";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";
import notificationRepository from "../repositories/notification.repository.js";

const router = express.Router();

router.get("/", guardAuthorizationJWT, retrieveAllForUser);
router.delete("/", guardAuthorizationJWT, deleteAllforUser);
router.delete("/:id", guardAuthorizationJWT, deleteOne);

async function retrieveAllForUser(req, res, next) {
  try {
    let notifications = await notificationRepository.retrieveAllForUser(
      req.auth.userId
    );
    notifications.map((c) => {
      c = c.toJSON();
      return c;
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function deleteOne(req, res, next) {
  try {
    const id = req.params.id;

    await notificationRepository.deleteOne(id);

    res.status(204).end();
  } catch (error) {
    console.log(err);
    return next(err);
  }
}

async function deleteAllforUser(req, res, next) {
  try {
    await notificationRepository.deleteAllforUser(req.auth.userId);

    res.status(204).end();
  } catch (error) {
    console.log(err);
    return next(err);
  }
}

export default router;
