const express = require("express");
// const axios = require("axios");
const TestRouter = express.Router();
const { validationCatch } = require("../middleware/validationCatch");
const { query, body } = require("express-validator");
const { ServerCommonError, CustomError, NaverSMSError } = require("../errors");

TestRouter.post(
  "/api/test",
  [body("phonenumber").isString().withMessage("전화번호가 필요합니다.")],
  validationCatch,
  async (req, res, next) => {
    try {
      const { phonenumber } = req.body;
      console.log("phone", phonenumber);
      return res.json({ success: true, data: { user: "찬진" } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

TestRouter.get(
  "/api/test",
  [
    // query("phonenumber")
    //   .isEmpty()
    //   .withMessage("전화번호 길이는 11자이어야 합니다."),
  ],
  validationCatch,
  async (req, res, next) => {
    try {
      console.log("phone");
      return res.json({ success: true, data: { user: "찬진" } });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      return next(new ServerCommonError(err));
    }
  }
);

module.exports = { TestRouter };
