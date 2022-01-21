const express = require('express');
const RouteTicketsNum = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

RouteTicketsNum.get(
  '/tickets/count',
  [],
  validationCatch,
  async (req, res, next) => {
    try {
      // 티켓 전체 수량 세기
      const ticketCount = await Ticket.find({
        status: { $in: ['confirm-deposit', 'enter'] }
      }).countDocuments();
      console.log(ticketCount);
      return res.custom200SuccessData({ticketCount : ticketCount});
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteTicketsNum };
