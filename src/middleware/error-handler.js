const { CustomError, Erromessage } = require("../errors/CustomError");
const ErrorMessage = require("../errors/ErrorMessage");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.customErrorWithMessageAndData(
      err.statusCode,
      err.serializeErrors(),
      err.data
    );
  }

  //un handled errors....

  return res.custom500FailMessage(ErrorMessage.INTERNAL_SERVER_ERROR);
};

module.exports = { errorHandler };
