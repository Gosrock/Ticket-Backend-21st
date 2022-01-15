const express = require('express');
// const axios = require("axios");
const RouteSendMessage = express.Router();
const { naverMessage } = require('../middleware/naverMessage');
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError, NaverSMSError } = require('../errors');

RouteSendMessage.get(
  '/auth/message',
  /*
  [body("receiver").isString().withMessage("전화번호가 필요합니다.")],
  validationCatch,
  */
  async (req, res, next) => {
    try {
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX
      //const { receiver, caller, certification } = req.body;
      /*
        var caller = "01028883492";
        var receiver = "01028883492";
        var certification = "1357";

        const code = naverMessage(
          caller,
          receiver,
          `이것은 고스락 테스트입니다 인증번호 ${certification}를 입력하세요`
        );
      */
      //XXXXX 문자 전송 부분입니다 실제로 사용하기 전까지 주석해제 XXXXX

      //임시변수
      var caller = '01028883492';
      var receiver = '01028883492';
      var certification = '1357';
      //임시변수

      console.log('complete');
      return res.json({
        success: true,
        status: 200,
        data: {
          user: '경민', //유저이름
          receiver: receiver, //수신번호
          certification: certification //인증번호
        } //엑세스 토큰으로 묶어 보내야함
      });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

RouteSendMessage.get('/auth/validation', async (req, res, next) => {
  try {
    //decode and compare
    console.log('phone');
    return res.send('text');
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    return next(new ServerCommonError(err));
  }
});

module.exports = { RouteSendMessage };
