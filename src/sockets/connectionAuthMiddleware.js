const SocketSingleton = require('./index.js');
const { AuthenticationError, CustomError } = require('../errors');
const ErrorMessage = require('../errors/ErrorMessage');
const { decodeToken } = require('../utils/decodeToken');

// 함수로 익스포트 ( 인증미들웨어 설정 )
module.exports = () => {
  SocketSingleton.adminSocket.use(async (socket, next) => {
    //handshake ( 헤더도 있고 인증영역도 있음 여기선 header token받음
    // console.log(socket);
    try {
      if (!socket.handshake.headers.adminaccesstoken) {
        throw new AuthenticationError('인증오류', ErrorMessage.TOKEN_NOT_EXIST);
      }
      const token = socket.handshake.headers.adminaccesstoken;
      const decodedToken = await decodeToken(
        token,
        process.env.JWT_KEY_ADMIN_ACCESS
      );

      // 접속한 어드민 정보 삽입.
      socket.data.adminInfo = decodedToken;

      next();
    } catch (err) {
      if (err instanceof CustomError) {
        next(err);
      }
      // 토큰 인증오류시 어떠한 인증오류인지 clientMessage에 담겨서 보내지게됨
      next(new AuthenticationError(err, err));
    }
  });
};
