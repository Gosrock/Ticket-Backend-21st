const express = require('express');
// const axios = require("axios");
const RoutePostTickets = express.Router();
const { validationCatch, userAuthentication } = require('../middleware');
const { query, body } = require('express-validator');
const { naverMessage } = require('../utils/naverMessage');
const moment = require('moment');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

const url = 'https://gosrock.link/tickets/';
RoutePostTickets.post(
  '/tickets',
  userAuthentication,
  [
    body('accountName')
      .isString()
      .withMessage('accountName 숫자로 필요합니다.')
      .isLength({ min: 2, max: 4 })
      .withMessage('name 길이는 3자이어야 합니다.'),
    body('studentID')
      .isString()
      .withMessage('studentID 필요합니다.')
      .isLength({ min: 7, max: 7 })
      .withMessage('studentID 길이는 7자이어야 합니다.')
      .matches(/^C235[0-5][0-9][0-9]|C211[0-2][0-9][0-9]/)
      .withMessage('신입생 학번이 맞지 않습니다.'),
    body('smallGroup').isBoolean().withMessage('Boolean 형식이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { phoneNumber, accountName, smallGroup, studentID } = req.body;
      console.log(phoneNumber, accountName);
      const caller = process.env.NAVER_CALLER;

      // 티켓 전체 수량 세기
      const [allTicketCount, phoneNumberFindTicket] = await Promise.all([
        Ticket.find().countDocuments(),
        Ticket.findOne({ phoneNumber: phoneNumber })
      ]);
      if (phoneNumberFindTicket) {
        // 해당 티켓이 이미 발급된 티켓이면 에러
        return res.custom400FailMessage('1인 1매 제한입니다.');
      }

      const ticket = new Ticket({
        ticketNumber: allTicketCount + 1,
        accountName,
        phoneNumber,
        smallGroup,
        studentID
      });
      // listOfTickets.push(ticket);

      let content = '고스락 티켓 ';

      // 리스트 형식이어야 함
      const messageSendContent = [
        {
          to: phoneNumber,
          content: content + url + `${ticket._id}`
        }
      ];

      await naverMessage(caller, phoneNumber, content, messageSendContent);

      // 병렬로 티켓 저장
      // 기획안 변경으로 티켓 단매로 바뀌었지만 리스트 구조는 그대로 유지
      // await Promise.all(
      //   listOfTickets.map(async ticket => {
      //     await ticket.save();
      //   })
      // );
      await ticket.save();

      return res.custom200SuccessData([ticket]);
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
