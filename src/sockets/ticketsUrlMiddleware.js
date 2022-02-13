const SocketSingleton = require('./index.js');
const { AuthenticationError, CustomError } = require('../errors');
const { Ticket } = require('../model');

// 함수로 익스포트 ( 인증미들웨어 설정 )
module.exports = () => {
  SocketSingleton.ticketsSocket.use(async (socket, next) => {
    try {
      if (!socket.handshake.auth.ticketId) {
        throw new AuthenticationError('인증오류', 'ticketid 필드가 없습니다.');
      }
      const ticketId = socket.handshake.auth.ticketId;
      const ticket = await Ticket.findOne({
        _id: ticketId
      });
      if (!ticket) {
        throw new AuthenticationError('인증오류', '잘못된 티켓 아이디 입니다.');
      }
      // 접속한 티켓의 정보 삽입.
      socket.data.ticketId = ticketId;
      next();
    } catch (err) {
      if (err instanceof CustomError) {
        next(err);
      }
      // 토큰 인증오류시 어떠한 인증오류인지 clientMessage에 담겨서 보내지게됨
      next(new AuthenticationError('인증오류'));
    }
  });
};
