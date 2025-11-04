import express from "express";
import certificationsRepository from "../repositories/certifications.repository.js";

const router = express.Router();
router.get("/", retrieveAll);

async function retrieveAll(req, res, next) {
    try {
        let certifications = await certificationsRepository.retrieveAll();
        certifications = certifications.map((c) => {
            c = c.toJSON();
            return c;
        });
        res.status(200).json(certifications);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}
