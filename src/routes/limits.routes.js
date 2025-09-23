import express from 'express';
import expressRateLimit from 'express-rate-limit';
import expressSlowDown from 'express-slow-down';

const router = express.Router();

const limiter = expressRateLimit();

const speedLimiter = expressSlowDown();

router.get('/rate-limit', limiter, rateLimit);
router.get('/speed-limit', speedLimiter, speedLimit);

function rateLimit(req, res, next) {
    res.status(200).json(req.rateLimit);
}

function speedLimit(req, res, next) {
    res.status(200).json(req.slowDown);
}

export default router;
