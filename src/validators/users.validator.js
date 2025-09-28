import expressValidator from 'express-validator';

const { body } = expressValidator;

class UsersValidators {
    postValidator() {
        return [
            body('username')
                .exists()
                .notEmpty()
                .withMessage('Username is required')
                .bail()
                .isString()
                .isLength({ min: 3, max: 255 })
                .withMessage('Username must be between 3 and 255 characters long'),
            body('password')
                .exists()
                .notEmpty()
                .withMessage('Password is required')
                .bail()
                .isString()
                .isLength({ min: 6, max: 255 })
                .withMessage('Password must be between 6 and 255 characters long'),
            body('email')
                .exists()
                .notEmpty()
                .withMessage('Email is required')
                .bail()
                .isEmail()
                .withMessage('Email not in valid format')
                .isLength({ max: 255 })
                .withMessage('Email must be less than 255 characters'),
            body('roleID')
                .exists()
                .notEmpty()
                .withMessage('Role ID is required')
                .bail()
                .isInt({ min: 1 })
                .withMessage('Role ID must be a positive integer'),
            body('secretQuestionID')
                .exists()
                .notEmpty()
                .withMessage('Secret Question ID is required')
                .bail()
                .isInt({ min: 1 })
                .withMessage('Secret Question ID must be a positive integer'),
            body('secretQuestionAnswer')
                .exists()
                .notEmpty()
                .withMessage('Secret Question Answer is required')
                .bail()
                .isString()
                .isLength({ min: 1, max: 255 })
                .withMessage('Secret Question Answer must be between 1 and 255 characters long'),
            body('profilePictureHref')
                .optional()
                .isString()
                .isLength({ max: 255 })
                .withMessage('Profile Picture URL must be less than 255 characters'),
            body('bannedUntil')
                .optional()
                .isISO8601()
                .withMessage('Banned Until must be a valid date (YYYY-MM-DD)')
        ];
    }
}

export default new UsersValidators();
