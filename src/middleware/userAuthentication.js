const { decodeToken } = require('../utils/decodeToken');
const { AuthenticationError, CustomError } = require('../errors');
const ErrorMessage = require('../errors/ErrorMessage');

const userAuthentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthenticationError(null, ErrorMessage.TOKEN_NOT_EXIST);
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await decodeToken(
      token,
      process.env.JWT_KEY_FRONT_ACCESS
    ).catch(err => {
      throw new AuthenticationError(err, err);
    });

    console.log(decodedToken);

    if (decodedToken) {
      req.body.phoneNumber = decodedToken.phoneNumber;
    }

    return next();
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    return next(new AuthenticationError(err, err));
  }
};

module.exports = { userAuthentication };
