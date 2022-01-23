const express = require('express');
const RouteAdminTicketsInfo = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket, Admin } = require('../model');
const { AdminAuthentication } = require('../middleware');

RouteAdminTicketsInfo.get(
  '/admin/tickets/info',
  //AdminAuthentication,
  [],
  validationCatch,
  async (req, res, next) => {
    try {
      //티켓관련
      let resultObject = {};
      const [
        issuedTickets,
        salesProceeds,
        confirmedDeposit,
        pendingDeposit,
        nonDeposit,
        entered,
        notEntered
      ] = await Promise.all([
        Ticket.countDocuments(),
        Ticket.countDocuments({
          status: {
            $in: ['confirm-deposit', 'enter']
          }
        }),
        Ticket.countDocuments({
          status: { $in: ['confirm-deposit', 'enter'] }
        }),
        Ticket.countDocuments({
          status: { $in: ['pending-deposit'] }
        }),
        Ticket.countDocuments({
          status: { $in: ['non-deposit'] }
        }),
        Ticket.countDocuments({
          status: { $in: ['enter'] }
        }),
        Ticket.countDocuments({
          status: { $in: ['confirm-deposit', 'pending-deposit', 'non-deposit'] }
        })
      ]);
      resultObject = {
        issuedTickets: issuedTickets,
        salesProceeds: salesProceeds * 3000,
        confirmedDeposit: confirmedDeposit,
        pendingDeposit: pendingDeposit,
        nonDeposit: nonDeposit,
        entered: entered,
        notEntered: notEntered
      };
      return res.custom200SuccessData(resultObject);
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
