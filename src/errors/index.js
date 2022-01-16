module.exports = {
  ...require('./CustomError'),
  ...require('./ServerCommonError'),
  ...require('./AuthenticationError'),
  ...require('./ValidationError'),
  ...require('./ErrorMessage')
};
