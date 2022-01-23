const express = require('express');
const RouteAdminTicketsStatus = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { param, query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');
const { AdminAuthentication } = require('../middleware');

RouteAdminTicketsStatus.patch(
  '/admin/tickets/:_id',
  //AdminAuthentication,
  [
    body('status')
      .isString()
      .withMessage('Status 필요합니다.')
      .isIn(['confirm-deposit', 'pending-deposit', 'enter', 'non-deposit'])
      .withMessage('Status 필요합니다.'),
    param('_id').isMongoId().withMessage('몽고아이디 형식이여야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      const ticketStatus = req.body.status;
      const id = req.params._id;
      console.log(id);
      // 요청 받은 아이디를 찾아서 그의 status를 요청받은 status로 변경해줘야 함

      const statusUpdate = await Ticket.findOneAndUpdate(
        { _id: id },
        { status: ticketStatus },
        { new: true }
      );
      console.log(statusUpdate);
      return res.custom200SuccessData(statusUpdate);
      //const updateStatus = await Ticket.findByIdAndUpdate( id, status, {new:true} ).exec();
      // return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);
module.exports = { RouteAdminTicketsStatus };
