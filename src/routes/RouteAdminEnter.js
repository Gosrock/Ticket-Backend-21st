const express = require('express');
const RouteAdminEnter = express.Router();
const { validationCatch, AdminAuthentication } = require('../middleware');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

RouteAdminEnter.post(
  '/admin/enter',
  AdminAuthentication,
  [body('ticketId').isMongoId().withMessage('몽고 아이디 형식이 아닙니다.')],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber, ticketId } = req.body;
      console.log(phoneNumber, ticketId);

      const ticket = await Ticket.findOne({
        _id: ticketId
      });
      if (ticket.status != 'confirm-deposit') {
        console.log('입장 불가');
        return res.custom400FailMessage(
          `${ticket.status} 티켓상태를 확인해주세요.`
        );
      }

      const ticketUpdated = await Ticket.findOneAndUpdate(
        {
          _id: ticketId
        },
        { status: 'enter' },
        { new: true }
      );
      console.log(ticketUpdated);

      return res.custom200SuccessMessage('성공');
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteAdminEnter };
