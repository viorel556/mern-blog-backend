import {validationResult} from "express-validator";

export default (req, res, next) => { // MIDDLEWARE:
    // trying validation:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next();
}