const { decodeToken } = require("../utils/decodeToken");
const {
  ForbiddenError,
  AuthenticationError,
  CustomError,
  StopUserError,
} = require("../errors");
const ErrorMessage = require("../errors/ErrorMessage");

const accessAuthentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthenticationError(null, ErrorMessage.TOKEN_NOT_EXIST);
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token, process.env.JWT_KEY_ACCESS);

    if (decodedToken) {
      req.body.decodedAccessToken = decodedToken;
    }
    // if (decodedToken.status.state != "normal") {
    //   var stateText = "";
    //   if (decodedToken.status.state == "stop") {
    //     stateText = "비활성";
    //     throw new StopUserError(null, {
    //       time: decodedToken.status.lastDate,
    //       message: `${decodedToken.userId}님은 ${stateText}된상태입니다.`,
    //     });
    //   }
    //   if (decodedToken.status.state == "forbidden") {
    //     stateText = "정지";
    //     throw new ForbiddenError(null, {
    //       time: decodedToken.status.lastDate,
    //       message: `${decodedToken.userId}님은 ${stateText}된상태입니다.`,
    //     });
    //   }
    // }
    return next();
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    return next(new AuthenticationError(err, err));
  }
};

module.exports = { accessAuthentication };
