const express = require('express');
// const axios = require("axios");
const RoutePatchTickets = express.Router();
const { validationCatch, userAuthentication } = require('../middleware');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');
const { body } = require('express-validator');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RoutePatchTickets.patch(
  '/tickets',
  userAuthentication,
  [body('smallGroup').isBoolean().withMessage('Boolean 형식이 아닙니다.')],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber, smallGroup } = req.body;

      // 티켓 전체 수량 세기
      const updatedTicket = await Ticket.findOneAndUpdate(
        {
          phoneNumber: phoneNumber
        },
        {
          smallGroup: smallGroup
        },
        { new: true }
      );

      if (!updatedTicket) {
        return res.custom400FailMessage('티켓정보없음');
      }

      return res.custom200SuccessData(updatedTicket);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RoutePatchTickets };
