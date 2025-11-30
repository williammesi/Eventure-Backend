import express from "express";
import HttpErrors from "http-errors";
import reportRepository from "../repositories/report.repository.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";

const router = express.Router();

router.get("/", retrieveAll);
router.post("/", guardAuthorizationJWT, create);
router.delete("/:reportId", guardAuthorizationJWT, deleteReport);

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

async function deleteReport(req, res, next) {
  try {
    const reportId = req.params.reportId;

    const deleted = await reportRepository.delete(reportId);
    
    if (!deleted) {
      throw HttpErrors.NotFound("Report non trouvé");
    }
    
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

export default router;
