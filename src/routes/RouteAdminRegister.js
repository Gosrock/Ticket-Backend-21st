const express = require('express');
const RouteAdminRegister = express.Router();
const { validationCatch } = require('../middleware/validationCatch');
const { body } = require('express-validator');
const { ServerCommonError, CustomError } = require('../errors');
const { Ticket, Admin } = require('../model');
const { hash } = require('bcryptjs');

// accessToken 미들웨어가 만들어지면 accessToken 에서 받아오는 걸로 수정 예정입니다.
RouteAdminRegister.post(
  '/admin/register',
  [
    body('userId')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 3, max: 20 })
      .withMessage('userId 길이는 3-20자이어야 합니다.')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('소문자 , 숫자만 가능합니다.'),
    body('name')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 3, max: 3 })
      .withMessage('name 길이는 3자이어야 합니다.'),
    body('password')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 6, max: 30 })
      .withMessage('password 길이는 6-30자이어야 합니다.'),
    body('gosrockCode')
      .isString()
      .withMessage('문자열 이어야합니다.')
      .isLength({ min: 4, max: 4 })
      .withMessage('gosrockCode 길이는 4자이어야 합니다.')
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      // 추후 phoneNumber 는 accessToken 미들웨어에서 가져올 예정입니다./
      const { userId, name, password, gosrockCode } = req.body;
      if (gosrockCode !== '1234') {
        return res.custom400FailMessage('코드오류');
      }
      console.log(userId, name, password);
      // 비밀번호 해쉬 암호화

      const hashedPassword = await hash(password, 10);
      const findAdmins = await Admin.aggregate([
        {
          $match: {
            $or: [{ name: { $eq: name } }, { userId: { $eq: userId } }]
          }
        }
      ]);

      if (findAdmins.length) {
        return res.custom400FailMessage('중복가입');
      }

      const newAdminUser = new Admin({
        password: hashedPassword,
        userId,
        name
      });

      await newAdminUser.save();

      console.log(newAdminUser);

      return res.custom200SuccessData(newAdminUser);
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { RouteAdminRegister };
