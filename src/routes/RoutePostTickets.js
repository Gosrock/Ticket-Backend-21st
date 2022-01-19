const express = require('express');
// const axios = require("axios");
const RoutePostTickets = express.Router();
const { validationCatch, userAuthentication } = require('../middleware');
const { query, body } = require('express-validator');
const { naverMessage } = require('../utils/naverMessage');

const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

const url = 'https://gosrock.link/ticket/';
RoutePostTickets.post(
  '/tickets',
  userAuthentication,
  [
    body('ticketCount')
      .isInt()
      .withMessage('ticketCount 0이상 10이하의 정수로 필요합니다.'),
    body('accountName').isString().withMessage('accountName 숫자로 필요합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber, ticketCount, accountName } = req.body;
      console.log(phoneNumber, ticketCount, accountName);
      const caller = process.env.NAVER_CALLER;

      if (ticketCount <= 0 || ticketCount > 10) {
        return res.custom400FailMessage('티켓수량오류');
      }

      let listOfTickets = [];
      // 티켓 전체 수량 세기
      const allTicketCount = await Ticket.find().countDocuments();

      for (step = 0; step < ticketCount; step++) {
        // 티켓 서버에서 발급
        const ticket = new Ticket({
          ticketNumber: allTicketCount + 1 + step,
          accountName,
          phoneNumber
        });
        listOfTickets.push(ticket);
      }
      let msgSubject = '고스락 티켓 발급';
      let content = '고스락 티켓\n';
      let count = 0;
      const multiContent = listOfTickets.map(ticket => {
        return {
          to: phoneNumber,
          content: content + ticketCount + '매' + url + `${ticket._id}` + '\n\n'
        };
      });
      // console.log(caller, content, getBytes(content));

      await naverMessage(caller, phoneNumber, content, multiContent);

      // 병렬로 티켓 저장
      //
      await Promise.all(
        listOfTickets.map(async ticket => {
          await ticket.save();
        })
      );

      return res.custom200SuccessData(listOfTickets);
      // return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RoutePostTickets };
function getBytes(string) {
  return Buffer.byteLength(string, 'utf8');
}
