const express = require('express');
// const axios = require("axios");
const RouteAdminRegister = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteAdminRegister.get(
  '/admin/register',
  [
    body('userId')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 3, max: 20 })
      .withMessage('userId 길이는 3-20자이어야 합니다.'),
    body('name')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 3, max: 3 })
      .withMessage('name 길이는 3자이어야 합니다.'),
    body('password')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 6, max: 30 })
      .withMessage('password 길이는 6-30자이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { userId, name, password } = req.query;
      console.log(phoneNumber);

      // 티켓 전체 수량 세기
      const myTickets = await Ticket.find({
        phoneNumber: phoneNumber
      });

      if (!myTickets.length) {
        return res.custom400FailMessage('예매티켓없음');
      }

      return res.custom200SuccessData(myTickets);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteAdminRegister };
