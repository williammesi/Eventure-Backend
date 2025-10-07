import expressValidator from "express-validator";

const { body } = expressValidator;

class EventsValidators {
  postValidator() {
    return [
      body("UserId")
        .exists()
        .notEmpty()
        .withMessage("UserId is required")
        .isNumeric(),
      body("LocationId")
        .exists()
        .notEmpty()
        .withMessage("LocationId is required")
        .isNumeric(),
      body("CategoryId")
        .exists()
        .notEmpty()
        .withMessage("CategoryId is required")
        .isNumeric(),
      body("Title")
        .exists()
        .notEmpty()
        .withMessage("Title is required")
        .bail()
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage("Title must be between 3 and 255 characters long"),
      body("MinPrice")
        .exists()
        .notEmpty()
        .withMessage("MinPrice is required")
        .isNumeric()
        .if(
          (value, { req }) =>
            req.body.MinPrice > 0 || req.body.MinPrice < req.body.MaxPrice
        ),
      body("MaxPrice")
        .exists()
        .notEmpty()
        .withMessage("MaxPrice is required")
        .isNumeric()
        .if(
          (value, { req }) =>
            req.body.MinPrice > 0 || req.body.MinPrice < req.body.MaxPrice
        ),
      body("StartingDate")
        .exists()
        .notEmpty()
        .withMessage("StartingDate is required")
        .isDate({ format: "yyyy-MM-dd" })
        .if(
          (value, { req }) =>
            req.body.StartingDate.getTime() < req.body.EndDate.getTime()
        ),
      body("EndDate")
        .exists()
        .notEmpty()
        .withMessage("EndDate is required")
        .isDate({ format: "yyyy-MM-dd" })
        .if(
          (value, { req }) =>
            req.body.StartingDate.getTime() < req.body.EndDate.getTime()
        ),
      body("Description")
        .exists()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage("Description must be between 3 and 255 characters long"),
      body("BookingURL")
        .exists()
        .notEmpty()
        .withMessage("BookingURL is required")
        .bail()
        .isURL(),
      body("Approved")
        .exists()
        .notEmpty()
        .withMessage("Approved is required")
        .bail()
        .isBoolean(),
    ];
  }
}

export default new EventsValidators();
