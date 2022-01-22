const express = require('express');
const RouteAdminTicketsInfo = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

RouteAdminTicketsInfo.get(
  '/admin/tickets/info',
  [
    query('status')
      .isString()
      .withMessage('Status 필요합니다.')
      .isIn([('confirm-deposit', 'pending-deposit', 'enter', 'non-deposit')])
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      //티켓관련
      const issuedTickets = await Ticket.find({
        status: {
          $in: ['confirm-deposit', 'pending-deposit', 'enter', 'non-deposit']
        }
      }).countDocuments();
      console.log(issuedTickets);
      const salesProceeds =
        (await Ticket.find({
          status: { $in: ['confirm-deposit', 'enter'] }
        }).countDocuments()) * 3000;
      console.log(salesProceeds);
      //입금관련
      const confirmedDeposit = await Ticket.find({
        status: { $in: ['confirm-deposit', 'enter'] }
      }).countDocuments();
      console.log(confirmedDeposit);
      const pendingDeposit = await Ticket.find({
        status: { $in: ['pending-deposit'] }
      }).countDocuments();
      console.log(pendingDeposit);
      const nonDeposit = await Ticket.find({
        status: { $in: ['non-deposit'] }
      }).countDocuments();
      console.log(nonDeposit);
      //입장확인
      const entered = await Ticket.find({
        status: { $in: ['enter'] }
      }).countDocuments();
      console.log(entered);
      const notEntered = issuedTickets - entered;
      console.log(notEntered);
      return res.custom200SuccessData({
        issuedTickets: issuedTickets,
        salesProceeds: salesProceeds,
        confirmedDeposit: confirmedDeposit,
        pendingDeposit: pendingDeposit,
        nonDeposit: nonDeposit,
        entered: entered,
        notEntered: notEntered
      });
      // return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);
module.exports = { RouteAdminTicketsInfo };
