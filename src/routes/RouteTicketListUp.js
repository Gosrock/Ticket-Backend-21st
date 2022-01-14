const express = require('express');
const RouteTicketListUp = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket, Admin } = require('../model');
const { hash } = require('bcryptjs');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteTicketListUp.get(
  '/admin/tickets',
  [
    query('page').isInt().withMessage('숫자만 들어와야합니다.'),
    query('searchString').custom(value => {
      if (value === '' || value !== '') {
        return true;
      }
    })
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      const countPage = req.query.page;
      const search = req.query.searchString;

      const offset = (countPage - 1) * 3;
      const limit = 3;

      console.log(`${countPage}번 페이지`);

      if (search.length < 1) {
        const ticketList = await Ticket.find()
          .limit(limit)
          .skip(offset)
          .sort({ ticketNumber: 1 });
        return res.custom200SuccessData(ticketList);
      }

      const ticketList = await Ticket.find({
        $or: [{ accountName: search }, { phoneNumber: { $regex: search } }]
      })
        .limit(limit)
        .skip(offset)
        .sort({ ticketNumber: 1 });

      return res.custom200SuccessData(ticketList);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteTicketListUp };
