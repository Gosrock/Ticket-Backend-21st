const express = require('express');
// const axios = require("axios");
const RoutePostAdminTickets = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket, Admin } = require('../model');
const { AdminAuthentication } = require('../middleware');
RoutePostAdminTickets.post(
  '/admin/tickets',
  AdminAuthentication,
  [
    body('phoneNumber')
      .matches(/^[0-9]+$/)
      .withMessage('숫자만 들어와야합니다.')
      .isLength({ min: 11, max: 11 })
      .withMessage('전화번호 길이는 11자이어야 합니다.'),
    body('ticketCount')
      .isInt()
      .withMessage('ticketCount 0이상 10이하의 정수로 필요합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber, ticketCount, adminUser } = req.body;
      console.log(phoneNumber, ticketCount, adminUser);

      if (ticketCount <= 0 || ticketCount > 10) {
        return res.custom400FailMessage('티켓수량오류');
      }

      let listOfTickets = [];
      // 티켓 전체 수량 세기
      const allTicketCount = await Ticket.find().countDocuments();
      const getAdminObjectId = await Admin.find({
        userId: adminUser.userId
      });
      console.log(getAdminObjectId[0]._id);
      for (step = 0; step < ticketCount; step++) {
        // 티켓 서버에서 발급
        const ticket = new Ticket({
          ticketNumber: allTicketCount + 1 + step,
          accountName: adminUser.name,
          adminTicket: true,
          manager: getAdminObjectId[0]._id,
          phoneNumber
        });
        listOfTickets.push(ticket);
      }

      // 병렬로 티켓 저장
      await Promise.all(
        listOfTickets.map(async ticket => {
          await ticket.save();
        })
      );

      return res.custom200SuccessData(listOfTickets);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RoutePostAdminTickets };
