const { CustomError } = require("./CustomError");

class AuthenticationError extends CustomError {
  constructor(message, clientMessage, data) {
    super(message);
    this.statusCode = 401;
    this.clientMessage = clientMessage;
    this.data = data;

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
  serializeErrors = function () {
    return this.clientMessage;
  };
}

module.exports = { AuthenticationError };
