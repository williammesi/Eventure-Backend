import express from "express";
import reportRepository from "../repositories/report.repository.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.get("/", guardAuthorizationJWT, retrieveAll);
router.post("/", guardAuthorizationJWT, create);

async function retrieveAll(req, res, next) {
  try {
    const reports = await reportRepository.retrieveAll();
    res.status(200).json(reports);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const userId = req.auth.userId;
    const newReport = await reportRepository.create(req.body, userId);
    res.status(201).json(newReport);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

export default router;
