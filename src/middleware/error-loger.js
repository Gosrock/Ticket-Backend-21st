const { ServerCommonError } = require("../errors/ServerCommonError");
const { winstonErrorLoger } = require("../utils/winstonErrorLoger");
const errorLoger = (err, req, res, next) => {
  if (err instanceof ServerCommonError) {
    winstonErrorLoger.log({ level: "error", message: err.stack });
    return next(err);
  }

  next(err);
};

module.exports = { errorLoger };
