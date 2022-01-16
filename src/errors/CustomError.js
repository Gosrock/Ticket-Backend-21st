class CustomError extends Error {
  constructor(message) {
    super(message);
    this.statusCode;
    this.clientMessage;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
  serializeErrors() {}
}

module.exports = { CustomError };
