import express from "express";
import certificationsRepository from "../repositories/certification.repository.js";

const router = express.Router();
router.get("/", retrieveAll);
router.patch("/:id/approve", approveCertification);
router.patch("/:id/reject", rejectCertification);

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

async function approveCertification(req, res, next) {
    try {
        const { id } = req.params;
        const certification = await certificationsRepository.approveCertification(id);
        if (!certification) {
            return res.status(404).json({ message: "Demande de certification non trouvée" });
        }
        res.status(200).json(certification.toJSON());
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

async function rejectCertification(req, res, next) {
    try {
        const { id } = req.params;
        const certification = await certificationsRepository.rejectCertification(id);
        if (!certification) {
            return res.status(404).json({ message: "Demande de certification non trouvée" });
        }
        res.status(200).json(certification.toJSON());
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

export default router;