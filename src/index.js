const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { TestRouter } = require("./routes");
const { customResponse } = require("./utils/customResponse");
const { errorHandler, errorLoger } = require("./middleware");

app.response = Object.create(customResponse);
const PORT = 5000;
const server = async () => {
  try {
    // const {
    //   MONGO_URI,
    //   JWT_KEY_REGISTER,

    // } = process.env;
    // if (
    //   !MONGO_URI ||
    //   !JWT_KEY_ACCESS ||
    // )
    //   throw new Error("MONGO_URI ,JWT_KEYis not defined env!");
    // await mongoose.connect(MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    // });
    // debug mode
    //  mongoose.set('debug', true)
    app.use(cors());
    //DB 를 먼저 연결하고 나서 요청을 받아야 오류가 안남! 굿... 좋네여,..
    // console.log("MongoDB conneted");
    // app.disable("etag");

    app.use(express.json());

    app.use(TestRouter);

    app.use(errorLoger);
    app.use(errorHandler);
    app.listen(PORT, async () => {
      console.log("server on.");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
