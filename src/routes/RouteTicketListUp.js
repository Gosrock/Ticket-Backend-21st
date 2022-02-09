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
    query('page')
      .exists()
      .withMessage('page넘버를 입력해주세요')
      .isInt()
      .withMessage('숫자만 입력해야 합니다'),
    query('searchType')
      .exists()
      .withMessage('검색타입을 입력해주세요')
      .isIn(['', 'accountName', 'phoneNumber', 'smallGroup'])
      .withMessage(
        '입력 가능 검색 타입은 "", accountName, phoneNumber ,smallGroup("신청" , "미신청")입니다.'
      ),
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
      const offset = (countPage - 1) * 15;
      const limit = 15;

      if (offset < 0) {
        return res.custom400FailMessage('페이지 넘버는 0보다 커야 합니다.');
      }
      let resultObject = {};
      console.log(`${countPage}번 페이지`);

      if (!searchType.length) {
        if (search.length > 0) {
          return res.custom400FailMessage('검색타입을 확인하세요');
        }
        const [totalCount, ticketList] = await Promise.all([
          Ticket.countDocuments(),
          Ticket.find()
            .limit(limit)
            .skip(offset)
            .sort({ ticketNumber: 1 })
            .populate({
              path: 'manager',
              model: 'admin',
              select: { _id: 1, name: 1 }
            })
        ]);

        if (totalCount && Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버가 너무 큽니다.');
        }

        if (!ticketList.length) {
          // 검색결과 없을시에 리턴임
          console.log(ticketList);
          return res.custom200SuccessData([]);
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
            .populate({
              path: 'manager',
              model: 'admin',
              select: { _id: 1, name: 1 }
            })
        ]);

        if (totalCount && Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버가 너무 큽니다.');
        }
        if (!ticketList.length) {
          // 검색결과 없을시에 리턴임
          console.log(ticketList);
          return res.custom200SuccessData([]);
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
            .populate({
              path: 'manager',
              model: 'admin',
              select: { _id: 1, name: 1 }
            })
        ]);
        if (totalCount && Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버가 너무 큽니다.');
        }

        if (!ticketList.length) {
          // 검색결과 없을시에 리턴임
          console.log(ticketList);
          return res.custom200SuccessData([]);
        }

        resultObject = {
          totalResultCount: totalCount,
          ticketList: ticketList,
          nextPageNum: countPage >= totalCount / limit ? null : countPage + 1
        };
      } else if (searchType === 'smallGroup') {
        // smallGroup 검색 기능 추가 ( 신청한 인원만 모아볼 수 있음)

        if (!(search === '신청' || search === '미신청')) {
          return res.custom400FailMessage(
            '검색 단어가 신청또는 미신청이 아닙니다.'
          );
        }
        const smallGroupState = search === '신청' ? true : false;
        const [totalCount, ticketList] = await Promise.all([
          Ticket.countDocuments({
            smallGroup: smallGroupState
          }),
          Ticket.find({
            smallGroup: smallGroupState
          })
            .limit(limit)
            .skip(offset)
            .sort({ ticketNumber: 1 })
            .populate({
              path: 'manager',
              model: 'admin',
              select: { _id: 1, name: 1 }
            })
        ]);
        if (totalCount && Math.ceil(totalCount / limit) < countPage) {
          return res.custom400FailMessage('페이지 넘버가 너무 큽니다.');
        }
        if (!ticketList.length) {
          // 검색결과 없을시에 리턴임
          console.log(ticketList);
          return res.custom200SuccessData([]);
        }
        console.log(totalCount, limit, Math.ceil(totalCount / limit));

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
