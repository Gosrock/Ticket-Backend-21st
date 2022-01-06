const { CustomError } = require("../errors/CustomError");
const ErrorMessage = require("./ErrorMessage");

class ServerCommonError extends CustomError {
  constructor(message, err) {
    super(message);
    this.statusCode = 500;
    this.clientMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
    Object.setPrototypeOf(this, ServerCommonError.prototype);
  }
  serializeErrors = function () {
    return this.clientMessage;
  };
}

module.exports = { ServerCommonError };
