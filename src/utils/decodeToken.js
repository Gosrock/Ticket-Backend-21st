const jwt = require("jsonwebtoken");
const ErrorMessage = require("../errors/ErrorMessage");

const decodeToken = (token, JWT_KEY) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (error, decoded) => {
      if (error) {
        if (error.name == "TokenExpiredError") {
          reject(ErrorMessage.TOKEN_EXPIRED);
        } else if (error.name == "JsonWebTokenError") {
          reject(ErrorMessage.TOKEN_INVALID);
        } else {
          reject(ErrorMessage.TOKEN_INVALID);
        }
      }
      resolve(decoded);
    });
  });
};

module.exports = { decodeToken };
