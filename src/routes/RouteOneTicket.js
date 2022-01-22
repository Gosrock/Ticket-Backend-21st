const express = require('express');
const RouteOneTicket = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { param } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

RouteOneTicket.get(
  '/tickets/:id',
  [param('id').isMongoId().withMessage('몽고 아이디 형식이 아닙니다.')],
  validationCatch,
  async (req, res, next) => {
    try {
      const ticketId = req.params.id;

      // 티켓 하나의 정보 받아오기
      const ticketInfo = await Ticket.findOne({
        _id: ticketId
      });

      // 티켓의 정보가 없을 때
      if (ticketInfo === null) {
        return res.custom400FailMessage('티켓정보없음');
      }

      return res.custom200SuccessData({ ticketInfo: ticketInfo });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteOneTicket };
