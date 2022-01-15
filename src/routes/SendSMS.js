const express = require('express');
// const axios = require("axios");
const router = express.Router();
const { naverSMS } = require('../middleware/naver-sms');
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError, NaverSMSError } = require('../errors');

router.post(
  '/message',
  [body('phonenumber').isString().withMessage('전화번호가 필요합니다.')],
  validationCatch,
  async (req, res, next) => {
    try {
      const { phonenumber } = req.body;
      console.log(naverSMS);
      return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

router.get('/validation', async (req, res, next) => {
  try {
    console.log('phone');
    return res.send('text');
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    return next(new ServerCommonError(err));
  }
});

module.exports = router;
