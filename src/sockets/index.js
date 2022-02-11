/*
 socket.io 싱글톤으로 빼기
*/
const { Server } = require('socket.io');
const { httpServer } = require('../index');

class SocketSingleton {
  constructor(httpServer) {
    // try catch  없이 초기 설정이 fail 하면 서버 바로 종료
    this.io = new Server(httpServer, {
      /* options */

      // 브라우저는 어드민 고스락에서만 접근이 가능하게 설정
      cors: {
        origin: 'https://admin.gosrock.link'
      }
    });
    this.adminSocket = this.io.of('/socket/admin');
    this.ticketsSocket = this.io.of('/socket/tickets');
    this.startCheck = false;
  }
  // 소켓 서버 실행 체크 변수

  // 소켓 서버 실행
  startSocketServer = () => {
    if (this.startCheck) throw Error('소켓서버를 이중으로 실행했습니다.');
    const connectionAuthMiddleware = require('./connectionAuthMiddleware');
    const ticketsUrlMiddleware = require('./ticketsUrlMiddleware');

    // const onConnection = socket => {
    //   registerOrderHandlers(io, socket);
    //   registerUserHandlers(io, socket);
    // };

    connectionAuthMiddleware();
    ticketsUrlMiddleware();
    this.io.on('connection', socket => {
      socket.disconnect();
    });
    this.adminSocket.on('connection', socket => {
      console.log('admin is enter', socket.data);
    });
    this.ticketsSocket.on('connection', socket => {
      console.log('tickets is enter', socket.data.ticketid);
      //룸에 강제삽입
      socket.join(socket.data.ticketid);
    });

    this.startCheck = true;
  };
}

module.exports = new SocketSingleton(httpServer);
