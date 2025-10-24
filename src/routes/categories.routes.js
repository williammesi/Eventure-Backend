import express from "express";
import categoryRepository from "../repositories/category.repository.js";

const router = express.Router();

router.get("/", retrieveAll);

async function retrieveAll(req, res, next) {
  try {
    let categories = await categoryRepository.retrieveAll();
    categories.map((c) => {
      c = c.toJSON();

      // TODO: c = category.Repository.transform(c, req.options);
      return c;
    });

    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

export default router;
