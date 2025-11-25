import express from "express";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt";
import notificationRepository from "../repositories/notification.repository";

const router = express.Router();

router.get("/:userId", guardAuthorizationJWT, retrieveAllForUser);

async function retrieveAllForUser(req, res, next) {
  try {
    let notifications = await notificationRepository.retrieveAllForUser(
      req.params.userId
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
