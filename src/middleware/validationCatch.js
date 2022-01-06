const { validationResult } = require("express-validator");
const { ValidationError } = require("../errors");
const validationCatch = (req, res, next) => {
  try {
    const result = validationResult(req);
    console.log(result.isEmpty());
    if (!result.isEmpty()) {
      throw new ValidationError(null, result.errors);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { validationCatch };
