const express = require('express');
// const axios = require("axios");
const RouteSendMessage = express.Router();
const { naverMessage } = require('../middleware/naverMessage');
const {
  authenticationMessageTokenGenerate
} = require('../utils/jwtTokenGenerate');
const { decodeToken } = require('../utils/decodeToken');
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError, NaverSMSError } = require('../errors');
const { hash } = require('bcryptjs');

const randomNumberGenerate = count => {
  let result = '';
  for (let i = 0; i < count; ++i) {
    result += Math.floor((Math.random() * 1234) % 10).toString();
  }
  return result;
};

RouteSendMessage.post(
  '/auth/message',
  [
    body('phoneNumber')
      .isString()
      .withMessage('전화번호가 필요합니다.')
      .isLength({ min: 11, max: 11 })
      .withMessage('전화번호 길이는 11자이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 환경변수(발신자 번호 확인)
      const caller = process.env.NAVER_CALLER;
      console.log(caller); //임시
      if (!caller) throw new Error('서버에서 발신번호를 지정하지 않았습니다');

      const { phoneNumber } = req.body;
      const authenticationNumber = randomNumberGenerate(6);
      console.log(authenticationNumber); //임시

      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX
      /*
        const code = naverMessage(
          caller,
          phoneNumber,
          `이것은 고스락 테스트입니다 인증번호 [${authenticationNumber}]를 입력하세요`
        );
      */
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX

      const messageToken = authenticationMessageTokenGenerate({
        phoneNumber,
        authenticationNumber
      });
      console.log(
        `Authentication Message has successfully sended to '${phoneNumber}'`
      );
      console.log(`TOKEN=${messageToken}`); //임시
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

RouteSendMessage.post(
  '/auth/validation',
  [
    body('messageToken')
      .isString()
      .withMessage('메세지 인증 토큰이 존재하지 않습니다.'),
    body('authenticationNumber')
      .isString()
      .withMessage('인증번호가 존재하지 않습니다.')
      .matches(/^[0-9]+$/)
      .withMessage('숫자만 들어와야합니다.')
      .isLength({ min: 6, max: 6 })
      .withMessage('인증번호 길이는 6자여야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      const { messageToken, authenticationNumber } = req.body;
      //decode and compare

      const decodedToken = await decodeToken(
        messageToken,
        process.env.JWT_KEY_ADMIN_ACCESS
      )
        .catch(err => {
          throw err;
        })
        .then(res => {
          return res;
        });

      console.log(decodedToken); //임시

      if (decodedToken.authenticationNumber === authenticationNumber) {
        return res.json({
          success: true,
          status: 200,
          data: {
            authenticated: true
          }
        });
      }
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteSendMessage };
