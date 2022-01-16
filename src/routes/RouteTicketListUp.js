const express = require('express');
const RouteTicketListUp = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket, Admin } = require('../model');
const { hash } = require('bcryptjs');
const { AdminAuthentication } = require('../middleware');
const e = require('express');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteTicketListUp.get(
  '/admin/tickets',
  AdminAuthentication,
  [
    query('page').isInt().withMessage('숫자만 들어와야합니다.'),
    query('searchType')
      .exists()
      .isIn(['', 'accountName', 'phoneNumber'])
      .withMessage('검색 타입을 입력해주세요'),
    query('searchString').custom(value => {
      if (value === '' || value !== '') {
        return true;
      }
    })
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      const { page, searchType, searchString: search } = req.query;
      const countPage = parseInt(page);
      const offset = (countPage - 1) * 3;
      const limit = 3;
      if (offset < 0) {
        return res.custom400FailMessage('페이지를 넘버 오류');
      }
      let resultObject = {};
      console.log(`${countPage}번 페이지`);

      if (!searchType.length) {
        const [totalCount, ticketList] = await Promise.all([
          Ticket.countDocuments(),
          Ticket.find().limit(limit).skip(offset).sort({ ticketNumber: 1 })
        ]);
        if (Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버 오류');
        }
        resultObject = {
          totalResultCount: totalCount,
          ticketList: ticketList,
          nextPageNum: countPage >= totalCount / limit ? null : countPage + 1
        };
      } else if (searchType === 'accountName') {
        const [totalCount, ticketList] = await Promise.all([
          Ticket.countDocuments({
            accountName: search
          }),
          Ticket.find({
            accountName: search
          })
            .limit(limit)
            .skip(offset)
            .sort({ ticketNumber: 1 })
        ]);
        if (Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버 오류');
        }
        resultObject = {
          totalResultCount: totalCount,
          ticketList: ticketList,
          nextPageNum: countPage >= totalCount / limit ? null : countPage + 1
        };
      } else if (searchType === 'phoneNumber') {
        const [totalCount, ticketList] = await Promise.all([
          Ticket.countDocuments({
            phoneNumber: { $regex: search }
          }),
          Ticket.find({
            phoneNumber: { $regex: search }
          })
            .limit(limit)
            .skip(offset)
            .sort({ ticketNumber: 1 })
        ]);
        if (Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버 오류');
        }
        resultObject = {
          totalResultCount: totalCount,
          ticketList: ticketList,
          nextPageNum: countPage >= totalCount / limit ? null : countPage + 1
        };
      }
      return res.custom200SuccessData(resultObject);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteTicketListUp };
