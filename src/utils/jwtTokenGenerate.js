const jwt = require('jsonwebtoken');

const accessTokenGenerate = user => {
  const userAccessJwt = jwt.sign(
    {
      phoneNumber: user.phoneNumber
    },
    process.env.JWT_KEY_FRONT_ACCESS,
    {
      expiresIn: '24h'
    }
  );
  return userAccessJwt;
};

const refreshTokenGenerate = user => {
  const userRefreshJwt = jwt.sign(
    {
      _id: user._id

      //나중에 refresh 토큰에 기기 고유 아이디 꼭 받으셈!!!!!!!!
    },
    process.env.JWT_KEY_REFRESH
  );

  console.log(userRefreshJwt);

  return userRefreshJwt;
};

const adminAccessTokenGenerate = ({ userId, name, _id }) => {
  const adminUserAccessJwt = jwt.sign(
    {
      _id: _id,
      name: name,
      userId: userId
    },
    process.env.JWT_KEY_ADMIN_ACCESS,
    {
      expiresIn: '1h'
    }
  );
  return adminUserAccessJwt;
};

const authenticationMessageTokenGenerate = ({
  phoneNumber,
  authenticationNumber
}) => {
  const authenticationMessageJwt = jwt.sign(
    {
      phoneNumber: phoneNumber,
      authenticationNumber: authenticationNumber
    },
    process.env.JWT_KEY_MESSAGE,
    {
      expiresIn: '3m'
    }
  );
  return authenticationMessageJwt;
};

module.exports = {
  accessTokenGenerate,
  refreshTokenGenerate,
  adminAccessTokenGenerate,
  authenticationMessageTokenGenerate
};
