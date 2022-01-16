const express = require('express');
const RouteAdminlogin = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Admin } = require('../model');
const { compare } = require('bcryptjs');
const { adminAccessTokenGenerate } = require('../utils/jwtTokenGenerate');
// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteAdminlogin.post(
  '/admin/login',
  [
    body('userId')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 3, max: 20 })
      .withMessage('userId 길이는 3-20자이어야 합니다.')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('소문자 , 숫자만 가능합니다.'),
    body('password')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 6, max: 30 })
      .withMessage('password 길이는 6-30자이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { userId, password } = req.body;

      // 티켓 전체 수량 세기
      const findAdmin = await Admin.findOne({ userId });
      if (!findAdmin) {
        return res.custom400FailMessage('아이디비밀번호오류');
      }

      const isValid = await compare(password, findAdmin.password);
      if (!isValid) {
        return res.custom400FailMessage('아이디비밀번호오류');
      }

      const adminAccessToken = adminAccessTokenGenerate(findAdmin);

      return res.custom200SuccessData({
        adminUser: findAdmin,
        adminAccessToken
      });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteAdminlogin };
