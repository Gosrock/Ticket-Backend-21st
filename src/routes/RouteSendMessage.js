const express = require('express');
// const axios = require("axios");
const RouteSendMessage = express.Router();
//const { naverMessage } = require('../middleware/naverMessage');
const {
  authenticationMessageTokenGenerate
} = require('../utils/jwtTokenGenerate');
const { decodeToekn } = require('../utils/decodeToken');
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError, NaverSMSError } = require('../errors');

RouteSendMessage.get(
  '/auth/message',
  /*
  [body("phoneNumber").isString().withMessage("전화번호가 필요합니다.")],
  validationCatch,
  */
  async (req, res, next) => {
    try {
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX
      //const { phoneNumber, authentication } = req.body;
      /*
        const caller = process.env.NAVER_CALLER;
        const code = naverMessage(
          caller,
          phoneNumber,
          `이것은 고스락 테스트입니다 인증번호 ${authentication}를 입력하세요`
        );
      */
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX

      // 환경변수(발신자 번호 확인)
      const caller = process.env.NAVER_CALLER;
      console.log(caller);
      if (!caller) throw new Error('서버에서 발신번호를 지정하지 않았습니다');

      //임시변수
      var phoneNumber = '01028883492';
      var authenticationNumber = '1357';

      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX
      //const { phoneNumber, authentication } = req.body;
      /*
        const caller = process.env.NAVER_CALLER;
        const code = naverMessage(
          caller,
          phoneNumber,
          `이것은 고스락 테스트입니다 인증번호 ${authentication}를 입력하세요`
        );
      */
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX

      const messageToken = authenticationMessageTokenGenerate({
        phoneNumber,
        authenticationNumber
      });
      console.log('Authentication Message has successfully sended');
      console.log(`TOKEN=${messageToken}`);
      return res.json({
        success: true,
        status: 200,
        data: {
          messageToken: messageToken
        }
      });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

RouteSendMessage.get(
  '/auth/validation',
  /*
  [body("phoneNumber").isString().withMessage("전화번호가 필요합니다.")],
  validationCatch,
  */
  async (req, res, next) => {
    try {
      const { messageToken } = req.body;
      if (!messageToken)
        throw new Error('메세지 인증 토큰이 존재하지 않습니다');

      //decode and compare
      try {
        const decodedToken = await decodeToken(
          messageToken,
          process.env.JWT_KEY_ADMIN_ACCESSW
        );
      } catch (err) {}

      console.log('phone');
      return res.send('text');
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteSendMessage };
