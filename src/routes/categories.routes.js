import express from "express";

const router = express.Router();

router.get("/", retrieveAll);

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
