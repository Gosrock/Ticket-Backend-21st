const express = require("express");

const customResponse = Object.create(express().response, {
  custom200SuccessData: {
    value: function (data) {
      // binding arrow function 해버리면 this가 풀려서 안됨
      return this.status(200).json({ status: 200, success: true, data: data });
    },
  },
  customCreateSuccessData: {
    value: function (data) {
      // binding arrow function 해버리면 this가 풀려서 안됨
      return this.status(201).json({ status: 201, success: true, data: data });
    },
  },
  custom200SuccessMessage: {
    value: function (msg) {
      return this.status(200).json({
        status: 200,
        success: true,
        message: msg,
      });
    },
  },
  custom200SuccessDataWithMessage: {
    value: function (data, msg) {
      return this.status(200).json({
        status: 200,
        success: true,
        data: data,
        message: msg,
      });
    },
  },
  custom400FailMessage: {
    value: function (msg) {
      return this.status(400).json({
        status: 400,
        success: false,
        message: msg,
      });
    },
  },
  custom500FailMessage: {
    value: function (msg) {
      return this.status(500).json({
        status: 500,
        success: false,
        message: msg,
      });
    },
  },
  customErrorWithMessageAndData: {
    value: function (status, msg, data) {
      return this.status(status).json({
        status: status,
        success: false,
        message: msg,
        data: data,
      });
    },
  },
});

module.exports = { customResponse };
