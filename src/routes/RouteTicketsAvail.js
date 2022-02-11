const express = require('express');
// const axios = require("axios");
const RouteTicketsAvail = express.Router();
const { validationCatch, userAuthentication } = require('../middleware');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteTicketsAvail.get(
  '/tickets/avail',
  userAuthentication,
  [],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber } = req.body;

      // 티켓 전체 수량 세기
      const myTicket = await Ticket.findOne({
        phoneNumber: phoneNumber
      });

      if (!myTicket) {
        // 티켓이 발급 가능한 상태
        return res.custom200SuccessData({ ticketingAvailable: true });
      }

      // 티켓이 발급 불가능한 상태 이미 발급 됨
      return res.custom200SuccessData({ ticketingAvailable: false });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteTicketsAvail };
