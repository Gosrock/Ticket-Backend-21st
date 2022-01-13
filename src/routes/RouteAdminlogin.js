const express = require('express');
// const axios = require("axios");
const RouteAdminlogin = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteAdminlogin.get(
  '/tickets',
  [
    query('phoneNumber')
      .matches(/^[0-9]+$/)
      .withMessage('숫자만 들어와야합니다.')
      .isLength({ min: 11, max: 11 })
      .withMessage('전화번호 길이는 11자이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber } = req.query;
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

module.exports = { RouteAdminlogin };
