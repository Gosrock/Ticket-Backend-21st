const express = require('express');
// const axios = require("axios");
const RoutePostAdminTickets = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');
const { AdminAuthentication } = require('../middleware');
RoutePostAdminTickets.post(
  '/admin/tickets',
  AdminAuthentication,
  [
    body('accountNameList').isArray().withMessage('배열을 필요로 합니다'),
    body('accountNameList.*.accountName')
      .isString()
      .withMessage('accountName을 가진 도큐멘트를 필요로 합니다')
      .isLength({ min: 1 })
      .withMessage('accountName의 길이가 1이상이어야합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { accountNameList, adminUser } = req.body;

      let listOfTickets = [];
      let step = 0;
      // 티켓 전체 수량 세기
      const allTicketCount = await Ticket.find().countDocuments();
      accountNameList.map(element => {
        const ticket = new Ticket({
          ticketNumber: allTicketCount + 1 + step,
          accountName: element.accountName,
          adminTicket: true,
          manager: adminUser._id,
          status: 'confirm-deposit'
        });
        step++;
        listOfTickets.push(ticket);
      });

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
