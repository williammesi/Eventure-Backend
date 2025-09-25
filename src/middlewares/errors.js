import httpErrors from 'http-errors';

export default (err, req, res, next) => {
    const error = {
        developerMessage: err.stack,
        userMessage: err.message
    };

    if (httpErrors.isHttpError(err)) {
        error.status = err.status;
    } else {
        if (err.code) {
            switch (err.code) {
                case 'ER_DUP_ENTRY':
                    error.status = 409;
                    error.userMessage = "Une valeur unique existe déjà dans la base de données.";
                    break;
                case 'ER_BAD_NULL_ERROR':
                    error.status = 400;
                    error.userMessage = "Un champ obligatoire est manquant.";
                    break;
                case 'ER_NO_REFERENCED_ROW_2':
                    error.status = 400;
                    error.userMessage = "Une clé étrangère est invalide.";
                    break;
                default:
                    error.status = 500;
            }
        }

        //JWT Error
        if (err.status) {
            error.status = err.status;
        }

        //Catch all -> 500
        if (!error.status) {
            error.status = 500;
        }
    }

    error.moreInfo = `http://documentation/errors/${error.status}`;

    if (process.env.NODE_ENV === 'development') {
        console.log(error.developerMessage);
    } else if (process.env.NODE_ENV === 'production') {
        delete error.developerMessage;
    }

    res.status(error.status).json(error);
};