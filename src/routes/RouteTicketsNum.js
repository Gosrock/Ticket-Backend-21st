const express = require('express');
// const axios = require("axios");
const RouteTicketsNum = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket } = require('../model');

RouteTicketsNum.get(
    '/tickets/count',
    [
    ],
    validationCatch,
    async (req, res, next) => {
        try {            
            // 티켓 전체 수량 세기
            const depositTickets = await Ticket.find({
                status : {$in : ['confirm-deposit', 'enter']}
            });
            
            return res.status(200).json(depositTickets.length);
        } catch (err) {
            if (err instanceof CustomError) {
                return next(err);
            }
            return next(new ServerCommonError(err));
        }
    }
);

module.exports = { RouteTicketsNum };