module.exports = {
  ...require('./validationCatch'),
  ...require('./tokenAuthentication.js'),
  ...require('./error-handler.js'),
  ...require('./error-loger.js'),
  ...require('./AdminAuthentication.js')
};
