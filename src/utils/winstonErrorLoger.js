const winston = require("winston");
const { combine, timestamp, json, logstash } = winston.format;
const winstonErrorLoger = winston.createLogger({
  //,
  level: "error",
  format: combine(timestamp(), logstash()),
  defaultMeta: { service: "serivce-auth" },
  transports: [new winston.transports.Console({})],
});

module.exports = { winstonErrorLoger };
