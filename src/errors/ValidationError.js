const { CustomError } = require("./CustomError");

const ErrorMessage = require("./ErrorMessage");

class ValidationError extends CustomError {
  constructor(message, data) {
    super(message);
    this.statusCode = 400;
    this.clientMessage = ErrorMessage.VALIDATION_ERROR;
    this.data = data;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  serializeErrors = function () {
    return this.clientMessage;
  };
}

module.exports = { ValidationError };
