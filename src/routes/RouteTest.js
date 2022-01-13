const express = require('express');
// const axios = require("axios");
const TestRouter = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { query, body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');

TestRouter.post(
  '/api/test',
  [body('name').isString().withMessage('name 필요합니다.')],
  validationCatch,
  async (req, res, next) => {
    try {
      const { phonenumber } = req.body;
      console.log('phone', phonenumber);

      return res.custom200SuccessData({ user: '찬진' });
      // return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

TestRouter.get(
  '/api/test',

  // 미들 웨어 달아서 인증 먼저
  [
    // query("phonenumber")
    //   .isEmpty()
    //   .withMessage("전화번호 길이는 11자이어야 합니다."),
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // const { decodedAccessToken } = req.body;
      console.log('phone');
      return res.json({ success: true, data: { user: '찬진' } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { TestRouter };
