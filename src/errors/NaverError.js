const { CustomError } = require('./CustomError');

const ErrorMessage = require('./ErrorMessage');

class NaverError extends CustomError {
  constructor(message, status) {
    super(message);
    this.statusCode = 400;
    switch (status) {
      case 401:
        this.clientMessage = ErrorMessage.NAVER_UNAUTHORIZED;
        break;
      case 403:
        this.clientMessage = ErrorMessage.NAVER_FORBIDDEN;
        break;
      case 404:
        this.clientMessage = ErrorMessage.NAVER_NOT_FOUND;
        break;
      case 415:
        this.clientMessage = ErrorMessage.NAVER_MEDIA_TYPE_ERROR;
        break;
      case 429:
        this.clientMessage = ErrorMessage.NAVER_TOO_MANY_REQUESTS;
        break;
      default:
        this.statusCode = 400;
        this.clientMessage = ErrorMessage.NAVER_FAILED;
        break;
    }
    Object.setPrototypeOf(this, NaverError.prototype);
  }
  serializeErrors = function () {
    return this.clientMessage;
  };
}

module.exports = { NaverError };
